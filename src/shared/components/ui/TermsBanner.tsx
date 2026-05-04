import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { acceptTermsRequest } from '@/modules/auth/services/auth.service'
import { ROUTES } from '@/routes/routes.config'

export default function TermsBanner() {
  const { user, setTermsAccepted } = useAuthStore()
  const [loading, setLoading] = useState(false)

  if (!user || user.termsAcceptedAt) return null

  async function handleAccept() {
    setLoading(true)
    try {
      const acceptedAt = await acceptTermsRequest()
      setTermsAccepted(acceptedAt)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="alert"
      className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <p className="text-sm text-yellow-900 leading-relaxed">
        Atualizamos nossos{' '}
        <Link to={ROUTES.TERMS} className="font-semibold underline hover:opacity-80" target="_blank">
          Termos de Uso e Política de Privacidade
        </Link>
        . Para continuar usando o PetHUB, por favor aceite os novos termos.
      </p>
      <button
        onClick={handleAccept}
        disabled={loading}
        className="shrink-0 px-4 py-2 rounded-lg bg-yellow-700 text-white text-sm font-semibold hover:bg-yellow-800 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Aguarde...' : 'Li e aceito'}
      </button>
    </div>
  )
}
