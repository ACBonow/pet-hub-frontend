import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes.config'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <div>PetHUB — Em desenvolvimento</div>,
  },
])
