import { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { useAuthStore } from './modules/auth/store/authSlice'
import { refreshTokenRequest } from './modules/auth/services/auth.service'
import { STORAGE_REFRESH_KEY, STORAGE_USER_KEY } from './modules/auth/hooks/useAuth'
import type { AuthUser } from './modules/auth/types'

export default function App() {
  const { setAuth } = useAuthStore()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem(STORAGE_REFRESH_KEY)
    const storedUserRaw = localStorage.getItem(STORAGE_USER_KEY)

    if (!storedRefreshToken || !storedUserRaw) {
      setIsInitializing(false)
      return
    }

    let storedUser: AuthUser
    try {
      storedUser = JSON.parse(storedUserRaw) as AuthUser
    } catch {
      localStorage.removeItem(STORAGE_REFRESH_KEY)
      localStorage.removeItem(STORAGE_USER_KEY)
      setIsInitializing(false)
      return
    }

    refreshTokenRequest({ refreshToken: storedRefreshToken })
      .then(({ accessToken, refreshToken: newRefreshToken }) => {
        // backend rotates the token — update stored value
        localStorage.setItem(STORAGE_REFRESH_KEY, newRefreshToken)
        setAuth(accessToken, storedUser)
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_REFRESH_KEY)
        localStorage.removeItem(STORAGE_USER_KEY)
      })
      .finally(() => {
        setIsInitializing(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="animate-spin w-10 h-10 border-4 border-[--color-primary] border-t-transparent rounded-full"
          aria-label="Carregando..."
        />
      </div>
    )
  }

  return <RouterProvider router={router} />
}
