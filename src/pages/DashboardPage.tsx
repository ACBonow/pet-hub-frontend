/**
 * @file DashboardPage.tsx
 * @description Authenticated user's management hub. Shows cards for each area of the system.
 */

import { Link } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { ROUTES } from '@/routes/routes.config'

interface DashboardCard {
  emoji: string
  title: string
  description: string
  to: string
  bgClass: string
  emojiClass: string
}

const CARDS: DashboardCard[] = [
  {
    emoji: '🐾',
    title: 'Meus Pets',
    description: 'Gerencie tutoria, saúde e histórico',
    to: ROUTES.PET.LIST,
    bgClass: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
    emojiClass: 'bg-violet-100',
  },
  {
    emoji: '🏢',
    title: 'Organizações',
    description: 'Empresas e ONGs que você gerencia',
    to: ROUTES.ORGANIZATION.LIST,
    bgClass: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    emojiClass: 'bg-blue-100',
  },
  {
    emoji: '❤️',
    title: 'Adoção',
    description: 'Publique pets disponíveis para adoção',
    to: ROUTES.ADOPTION.CREATE,
    bgClass: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    emojiClass: 'bg-pink-100',
  },
  {
    emoji: '🔍',
    title: 'Achados e Perdidos',
    description: 'Registre animal perdido ou encontrado',
    to: ROUTES.LOST_FOUND.CREATE,
    bgClass: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    emojiClass: 'bg-amber-100',
  },
  {
    emoji: '🏥',
    title: 'Serviços',
    description: 'Explore o diretório de serviços pet',
    to: ROUTES.SERVICES.LIST,
    bgClass: 'bg-green-50 border-green-200 hover:bg-green-100',
    emojiClass: 'bg-green-100',
  },
  {
    emoji: '👤',
    title: 'Meu Perfil',
    description: 'Edite seus dados pessoais',
    to: ROUTES.PROFILE,
    bgClass: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
    emojiClass: 'bg-gray-100',
  },
]

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <AppShell>
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Olá{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">O que você quer gerenciar hoje?</p>
      </div>

      <PageWrapper>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={[
                'flex flex-col gap-3 p-4 rounded-2xl border transition-colors',
                card.bgClass,
              ].join(' ')}
            >
              <span className={`w-10 h-10 flex items-center justify-center rounded-xl text-2xl ${card.emojiClass}`}>
                {card.emoji}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{card.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </PageWrapper>
    </AppShell>
  )
}
