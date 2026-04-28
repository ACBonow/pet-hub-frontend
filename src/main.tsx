import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './styles/tokens.css'
import App from './App'
import { setApiBaseUrl } from './shared/services/api.client'
import { setGoogleMapsKey, setGoogleMapsMapId } from './shared/config/googleMaps'

setApiBaseUrl(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000')
setGoogleMapsKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '')
setGoogleMapsMapId(import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || '')

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
