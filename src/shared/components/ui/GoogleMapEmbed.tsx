import { getGoogleMapsKey } from '@/shared/config/googleMaps'

interface GoogleMapEmbedProps {
  address: string
  className?: string
}

export default function GoogleMapEmbed({ address, className = '' }: GoogleMapEmbedProps) {
  const apiKey = getGoogleMapsKey()
  if (!apiKey || !address.trim()) return null

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&language=pt-BR`

  return (
    <div className={`w-full rounded-2xl overflow-hidden border border-line ${className}`}>
      <iframe
        title="Localização no mapa"
        src={src}
        width="100%"
        height="300"
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
