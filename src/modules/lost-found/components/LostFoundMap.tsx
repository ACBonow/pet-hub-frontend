import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { getGoogleMapsKey, getGoogleMapsMapId } from '@/shared/config/googleMaps'
import { ROUTES } from '@/routes/routes.config'
import type { LostFoundReport } from '@/modules/lost-found/types'

interface Props {
  reports: LostFoundReport[]
  lostCount: number
  foundCount: number
}

const geocodeCache = new Map<string, { lat: number; lng: number } | null>()

const MIN_HEIGHT = 160
const MAX_HEIGHT = 600
const DEFAULT_HEIGHT = 240

function buildGeocodingAddress(report: LostFoundReport): string | null {
  const parts = [
    report.addressStreet && report.addressNumber
      ? `${report.addressStreet}, ${report.addressNumber}`
      : report.addressStreet,
    report.addressNeighborhood,
    report.addressCity,
    report.addressState,
  ].filter(Boolean)

  if (parts.length > 0) return `${parts.join(', ')}, Brasil`
  if (report.location) return `${report.location}, Brasil`
  return null
}

function buildPin(isLost: boolean): HTMLElement {
  const color = isLost ? '#e84040' : '#3db96e'

  const wrapper = document.createElement('div')
  wrapper.style.cssText = [
    'display:flex;flex-direction:column;align-items:center',
    'cursor:pointer',
    'filter:drop-shadow(0 3px 6px rgba(0,0,0,0.28))',
  ].join(';')

  const circle = document.createElement('div')
  circle.style.cssText = [
    'width:36px;height:36px;border-radius:50%',
    `background:${color}`,
    'border:3px solid #fff',
    'display:flex;align-items:center;justify-content:center',
    'flex-shrink:0',
    'overflow:hidden',
  ].join(';')

  const emoji = document.createElement('span')
  emoji.style.cssText = 'font-size:17px;line-height:1;display:block'
  emoji.textContent = '🐾'
  circle.appendChild(emoji)

  const arrow = document.createElement('div')
  arrow.style.cssText = [
    'width:0;height:0;margin-top:-1px',
    'border-left:8px solid transparent',
    'border-right:8px solid transparent',
    `border-top:10px solid ${color}`,
  ].join(';')

  wrapper.appendChild(circle)
  wrapper.appendChild(arrow)
  return wrapper
}

export default function LostFoundMap({ reports, lostCount, foundCount }: Props) {
  const apiKey = getGoogleMapsKey()
  const mapId = getGoogleMapsMapId()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const navigate = useNavigate()
  const [loadError, setLoadError] = useState(false)
  const [ready, setReady] = useState(false)
  const [mapHeight, setMapHeight] = useState(DEFAULT_HEIGHT)
  const isDragging = useRef(false)
  const dragStartY = useRef(0)
  const dragStartH = useRef(0)

  // Load Maps JS API once
  useEffect(() => {
    if (!apiKey) return
    setOptions({ key: apiKey, v: 'weekly' })
    Promise.all([importLibrary('maps'), importLibrary('marker'), importLibrary('geocoding')])
      .then(() => setReady(true))
      .catch(() => setLoadError(true))
  }, [apiKey])

  // Initialize map once after API is ready
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: -30.0346, lng: -51.2177 },
      mapId,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      gestureHandling: 'cooperative',
    })
  }, [ready, mapId])

  // Notify Maps of container resize
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !window.google) return
    window.google.maps.event.trigger(map, 'resize')
  }, [mapHeight])

  // Center on user's location
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !ready || !window.google || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        if (markersRef.current.length === 0) {
          map.setCenter(userPos)
          map.setZoom(12)
        }
        const dot = document.createElement('div')
        dot.style.cssText = [
          'width:16px;height:16px;border-radius:50%',
          'background:#4285F4',
          'border:3px solid #fff',
          'box-shadow:0 2px 6px rgba(66,133,244,0.5)',
        ].join(';')
        if (userMarkerRef.current) userMarkerRef.current.map = null
        userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: userPos,
          content: dot,
          title: 'Você está aqui',
          zIndex: 1000,
        })
      },
      () => {},
      { timeout: 8000 },
    )
  }, [ready])

  // Place markers whenever reports change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !ready || !window.google) return

    markersRef.current.forEach((m) => { m.map = null })
    markersRef.current = []

    const geocoder = new window.google.maps.Geocoder()
    const bounds = new window.google.maps.LatLngBounds()
    let hasAnyCoord = false

    const reportsToGeocode = reports.filter((r) => buildGeocodingAddress(r) !== null)

    Promise.all(
      reportsToGeocode.map(async (report) => {
        const address = buildGeocodingAddress(report)!
        let coords = geocodeCache.get(address)
        if (coords === undefined) {
          try {
            const result = await geocoder.geocode({ address })
            const loc = result.results[0]?.geometry?.location
            coords = loc ? { lat: loc.lat(), lng: loc.lng() } : null
          } catch (err) {
            console.error('[LostFoundMap] geocoding failed for:', address, err)
            coords = null
          }
          geocodeCache.set(address, coords)
        }
        if (!coords) return

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: coords,
          content: buildPin(report.type === 'LOST'),
          title: report.petName ?? (report.type === 'LOST' ? 'Perdido' : 'Achado'),
        })
        marker.addListener('gmp-click', () => {
          navigate(ROUTES.LOST_FOUND.DETAIL(report.id))
        })
        markersRef.current.push(marker)
        bounds.extend(coords)
        hasAnyCoord = true
      }),
    ).then(() => {
      if (hasAnyCoord) {
        map.fitBounds(bounds, 60)
        const listener = window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          if (map.getZoom()! > 14) map.setZoom(14)
        })
        return () => window.google.maps.event.removeListener(listener)
      }
    })
  }, [reports, ready, navigate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => { m.map = null })
      if (userMarkerRef.current) userMarkerRef.current.map = null
    }
  }, [])

  // Drag-to-resize logic
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragStartH.current = mapHeight
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return
      const y = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY
      const delta = y - dragStartY.current
      setMapHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, dragStartH.current + delta)))
    }
    const onUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  if (!apiKey || !mapId || loadError) return null

  return (
    <div className="relative rounded-2xl overflow-hidden mb-3 border border-line select-none" style={{ height: mapHeight }}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-line flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-red shrink-0" />
          <span className="text-body font-medium">Perdidos ({lostCount})</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-green shrink-0" />
          <span className="text-body font-medium">Achados ({foundCount})</span>
        </div>
      </div>

      {/* Drag-to-resize handle */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className="absolute bottom-0 left-0 right-0 h-5 flex items-center justify-center cursor-ns-resize bg-gradient-to-t from-black/20 to-transparent"
        title="Arraste para redimensionar"
      >
        <div className="w-10 h-1 rounded-full bg-white/80" />
      </div>
    </div>
  )
}
