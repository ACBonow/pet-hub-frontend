import { Link } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from '@/routes/routes.config'
import Icon from '@/shared/components/ui/Icon'

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <header className="sticky top-0 z-10 bg-bg-warm/85 backdrop-blur-sm border-b border-line px-4 py-3 lg:px-8 flex items-center gap-3 shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-xl border border-line bg-card flex items-center justify-center hover:border-line-strong transition-colors shrink-0"
        aria-label="Abrir menu de navegação"
      >
        <Icon name="menu" size={18} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-[560px] bg-card border border-line rounded-xl px-3.5 py-2 flex items-center gap-2.5">
        <span className="text-muted shrink-0">
          <Icon name="search" size={16} />
        </span>
        <input
          className="flex-1 bg-transparent outline-none text-sm text-body placeholder:text-muted min-w-0"
          placeholder="Buscar pets, ONGs, serviços..."
          readOnly
          aria-label="Busca global"
        />
        <span className="text-[10px] text-muted bg-soft px-1.5 py-0.5 rounded font-mono hidden sm:block shrink-0">
          ⌘K
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        <button
          className="w-9 h-9 rounded-xl border border-line bg-card flex items-center justify-center text-body hover:border-line-strong transition-colors"
          aria-label="Notificações"
        >
          <Icon name="bell" size={17} />
        </button>

        {isAuthenticated && user ? (
          <Link
            to={ROUTES.PROFILE}
            aria-label={`Perfil de ${user.name}`}
            className="w-9 h-9 rounded-xl bg-green flex items-center justify-center text-white font-bold text-sm shrink-0 hover:opacity-90 transition-opacity"
          >
            {user.name.charAt(0).toUpperCase()}
          </Link>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-semibold px-4 py-2 bg-green text-white rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
