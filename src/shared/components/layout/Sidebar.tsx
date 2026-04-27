import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ROUTES } from '@/routes/routes.config'
import Icon from '@/shared/components/ui/Icon'
import LogoMark from '@/shared/components/ui/LogoMark'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItemBase = [
  'flex items-center gap-3 px-3 py-2.5 rounded-xl',
  'text-sm font-medium transition-colors w-full text-left',
].join(' ')

function navItemClass({ isActive }: { isActive: boolean }) {
  return `${navItemBase} ${
    isActive
      ? 'bg-green-light text-green-dark font-bold'
      : 'text-body hover:bg-soft'
  }`
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate(ROUTES.HOME)
  }

  const homeRoute = isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Navegação lateral"
        className={[
          'fixed lg:sticky lg:top-0',
          'inset-y-0 left-0 lg:inset-auto',
          'w-[248px] h-svh',
          'bg-card border-r border-line',
          'flex flex-col',
          'overflow-y-auto',
          'px-4 py-5',
          'transition-transform duration-200 ease-in-out',
          'z-[100] lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'shrink-0',
        ].join(' ')}
      >
        {/* Logo */}
        <Link
          to={homeRoute}
          onClick={onClose}
          className="flex items-center gap-2.5 px-2 pb-4 mb-1 border-b border-line shrink-0"
          aria-label="Tchê PetHub — página inicial"
        >
          <LogoMark size={20} />
        </Link>

        {/* Explorar */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted px-2.5 pt-3 pb-1 shrink-0">
          Explorar
        </p>
        <nav aria-label="Explorar">
          <NavLink to={homeRoute} end className={navItemClass} onClick={onClose}>
            <Icon name="home" size={18} /> Início
          </NavLink>
          <NavLink to={ROUTES.ADOPTION.LIST} className={navItemClass} onClick={onClose}>
            <Icon name="heart" size={18} /> Adoção
          </NavLink>
          <NavLink to={ROUTES.LOST_FOUND.LIST} className={navItemClass} onClick={onClose}>
            <Icon name="search" size={18} /> Perdidos &amp; Achados
          </NavLink>
          <NavLink to={ROUTES.SERVICES.LIST} className={navItemClass} onClick={onClose}>
            <Icon name="stethoscope" size={18} /> Serviços
          </NavLink>
        </nav>

        {/* Minha conta */}
        {isAuthenticated && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted px-2.5 pt-4 pb-1 shrink-0">
              Minha conta
            </p>
            <nav aria-label="Minha conta">
              <NavLink to={ROUTES.PET.LIST} className={navItemClass} onClick={onClose}>
                <Icon name="paw" size={18} /> Meus Pets
              </NavLink>
              <NavLink to={ROUTES.ORGANIZATION.LIST} className={navItemClass} onClick={onClose}>
                <Icon name="building" size={18} /> Organizações
              </NavLink>
              <NavLink to={ROUTES.PROFILE} className={navItemClass} onClick={onClose}>
                <Icon name="user" size={18} /> Perfil
              </NavLink>
            </nav>
          </>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-line shrink-0">
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 px-2 py-1.5">
                <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-body truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-muted truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted hover:bg-soft hover:text-body w-full transition-colors"
              >
                <Icon name="logout" size={16} />
                Sair
              </button>
            </div>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              onClick={onClose}
              className="flex items-center justify-center px-4 py-2.5 bg-green text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity w-full"
            >
              Entrar
            </Link>
          )}
        </div>
      </aside>
    </>
  )
}
