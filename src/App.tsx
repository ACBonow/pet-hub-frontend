import { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { useAuthStore } from './modules/auth/store/authSlice'
import { refreshTokenRequest } from './modules/auth/services/auth.service'
import { STORAGE_REFRESH_KEY, STORAGE_USER_KEY } from './modules/auth/hooks/useAuth'
import { setRefreshHandlers } from './shared/services/api.client'
import ErrorBoundary from './shared/components/ui/ErrorBoundary'
import type { AuthUser } from './modules/auth/types'

// Configure the 401 auto-refresh handler once at module load.
// Uses getState() to avoid stale closure over store values.
setRefreshHandlers(
  (token) => refreshTokenRequest({ refreshToken: token }),
  (accessToken, newRefreshToken) => {
    localStorage.setItem(STORAGE_REFRESH_KEY, newRefreshToken)
    const user = useAuthStore.getState().user
    if (user) useAuthStore.getState().setAuth(accessToken, user)
  },
  () => {
    localStorage.removeItem(STORAGE_REFRESH_KEY)
    localStorage.removeItem(STORAGE_USER_KEY)
    useAuthStore.getState().clearAuth()
    window.location.href = '/login'
  },
)

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
      <div className="min-h-svh flex items-center justify-center bg-bg-warm">
        <div
          className="animate-spin w-10 h-10 border-4 border-green border-t-transparent rounded-full"
          aria-label="Carregando..."
        />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
