import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { getGoogleMapsKey } from '@/shared/config/googleMaps'
import { ROUTES } from '@/routes/routes.config'
import type { LostFoundReport } from '@/modules/lost-found/types'

interface Props {
  reports: LostFoundReport[]
  lostCount: number
  foundCount: number
}

// Module-level cache so geocoding results survive re-renders and filter changes
const geocodeCache = new Map<string, { lat: number; lng: number } | null>()

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

export default function LostFoundMap({ reports, lostCount, foundCount }: Props) {
  const apiKey = getGoogleMapsKey()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const navigate = useNavigate()
  const [loadError, setLoadError] = useState(false)
  const [ready, setReady] = useState(false)

  // Load the Maps JS API once
  useEffect(() => {
    if (!apiKey) return

    setOptions({ key: apiKey, v: 'weekly', libraries: ['geocoding', 'marker'] })

    importLibrary('maps')
      .then(() => setReady(true))
      .catch(() => setLoadError(true))
  }, [apiKey])

  // Initialize map once after API is ready
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: -30.0346, lng: -51.2177 }, // Porto Alegre as default
      mapId: 'pethub-lost-found',
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'cooperative',
    })
  }, [ready])

  // Place markers whenever reports change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !ready || !window.google) return

    // Clear existing markers
    markersRef.current.forEach((m) => { m.map = null })
    markersRef.current = []

    const geocoder = new window.google.maps.Geocoder()
    const bounds = new window.google.maps.LatLngBounds()
    let hasAnyCoord = false

    const reportsToGeocode = reports.filter((r) => buildGeocodingAddress(r) !== null)

    Promise.all(
      reportsToGeocode.map(async (report) => {
        const address = buildGeocodingAddress(report)!

        // Use cache to avoid redundant geocoding calls
        let coords = geocodeCache.get(address)
        if (coords === undefined) {
          try {
            const result = await geocoder.geocode({ address })
            const loc = result.results[0]?.geometry?.location
            coords = loc ? { lat: loc.lat(), lng: loc.lng() } : null
          } catch {
            coords = null
          }
          geocodeCache.set(address, coords)
        }

        if (!coords) return

        const pin = document.createElement('div')
        const isLost = report.type === 'LOST'
        pin.style.cssText = [
          'width:30px;height:30px;border-radius:50%',
          `background:${isLost ? '#e84040' : '#3db96e'}`,
          'border:2.5px solid #fff',
          'display:flex;align-items:center;justify-content:center',
          'cursor:pointer',
          'box-shadow:0 2px 8px rgba(0,0,0,0.25)',
          'font-size:13px',
        ].join(';')
        pin.textContent = '🐾'

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: coords,
          content: pin,
          title: report.petName ?? (isLost ? 'Perdido' : 'Achado'),
        })

        marker.addListener('click', () => {
          navigate(ROUTES.LOST_FOUND.DETAIL(report.id))
        })

        markersRef.current.push(marker)
        bounds.extend(coords)
        hasAnyCoord = true
      }),
    ).then(() => {
      if (hasAnyCoord) {
        map.fitBounds(bounds, 60)
        // Don't zoom in too much for a single point
        const listener = window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          if (map.getZoom()! > 14) map.setZoom(14)
        })
        // Cleanup listener if component unmounts before event fires
        return () => window.google.maps.event.removeListener(listener)
      }
    })
  }, [reports, ready, navigate])

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => { m.map = null })
    }
  }, [])

  if (!apiKey || loadError) return null

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 border border-line" style={{ height: 240 }}>
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
    </div>
  )
}
