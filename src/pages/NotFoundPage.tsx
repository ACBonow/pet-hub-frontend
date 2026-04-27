import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { ROUTES } from '@/routes/routes.config'
import LogoMark from '@/shared/components/ui/LogoMark'

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 px-4 text-center animate-slide-up">
        <LogoMark size={24} />
        <p
          className="font-fraunces font-black text-[120px] leading-none tracking-tight text-soft"
          aria-hidden="true"
        >
          404
        </p>
        <p className="text-2xl font-extrabold text-ink -mt-8">Página não encontrada</p>
        <p className="text-sm text-muted max-w-xs leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-green text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Voltar para o início
        </Link>
      </div>
    </PublicLayout>
  )
}
