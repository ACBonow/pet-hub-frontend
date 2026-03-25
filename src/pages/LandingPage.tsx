/**
 * @file LandingPage.tsx
 * @description Public landing page with hero section and three horizontal carousels:
 * adoption listings, lost & found reports, and services directory.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import AdoptionCard from '@/modules/adoption/components/AdoptionCard'
import LostFoundCard from '@/modules/lost-found/components/LostFoundCard'
import ServiceCard from '@/modules/services-directory/components/ServiceCard'
import { listAdoptionsRequest } from '@/modules/adoption/services/adoption.service'
import { listReportsRequest } from '@/modules/lost-found/services/lostFound.service'
import { listServicesRequest } from '@/modules/services-directory/services/servicesDirectory.service'
import type { AdoptionListing } from '@/modules/adoption/types'
import type { LostFoundReport } from '@/modules/lost-found/types'
import type { ServiceListing } from '@/modules/services-directory/types'
import { ROUTES } from '@/routes/routes.config'

const CAROUSEL_LIMIT = 6

interface CarouselSectionProps {
  title: string
  emoji: string
  viewAllTo: string
  accentClass: string
  children: React.ReactNode
  isEmpty: boolean
  emptyMessage: string
}

function CarouselSection({ title, emoji, viewAllTo, accentClass, children, isEmpty, emptyMessage }: CarouselSectionProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl ${accentClass}`}>
            {emoji}
          </span>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        <Link
          to={viewAllTo}
          className="text-sm font-semibold text-[--color-primary] hover:underline"
          aria-label={`Ver todos de ${title}`}
        >
          Ver todos →
        </Link>
      </div>
      {isEmpty ? (
        <p className="px-4 text-sm text-gray-400 italic">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto px-4 pb-2 scrollbar-none">
          {children}
        </div>
      )}
    </section>
  )
}

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  const [adoptions, setAdoptions] = useState<AdoptionListing[]>([])
  const [reports, setReports] = useState<LostFoundReport[]>([])
  const [services, setServices] = useState<ServiceListing[]>([])

  useEffect(() => {
    listAdoptionsRequest({ status: 'AVAILABLE' })
      .then((data) => setAdoptions(data.slice(0, CAROUSEL_LIMIT)))
      .catch(() => {})

    listReportsRequest({ status: 'OPEN' })
      .then((data) => setReports(data.slice(0, CAROUSEL_LIMIT)))
      .catch(() => {})

    listServicesRequest({ pageSize: CAROUSEL_LIMIT })
      .then((data) => setServices(data?.data ?? []))
      .catch(() => {})
  }, [])

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[--color-primary] to-violet-600 text-white px-6 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-7xl mb-4 drop-shadow-lg">🐾</div>
          <h1 className="text-3xl font-extrabold mb-3 drop-shadow">Bem-vindo ao PetHUB</h1>
          <p className="text-base text-white/80 mb-8 leading-relaxed">
            O lar digital dos seus pets. Adote, encontre e cuide de quem você ama.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={ROUTES.ADOPTION.LIST}
              className="bg-white text-[var(--color-primary)] font-bold px-6 py-3 rounded-full shadow hover:bg-gray-50 transition-colors text-sm"
            >
              ❤️ Ver pets para adoção
            </Link>
            <Link
              to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
              className="border-2 border-white/60 text-white font-bold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm"
            >
              Cadastrar meu pet
            </Link>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 px-4 py-5 max-w-screen-xl mx-auto">
        <Link
          to={ROUTES.ADOPTION.LIST}
          className="flex flex-col items-center gap-2 bg-pink-50 border border-pink-100 rounded-2xl py-4 px-2 hover:bg-pink-100 transition-colors"
        >
          <span className="text-3xl">🐶</span>
          <span className="text-xs font-semibold text-pink-700 text-center">Adoção</span>
        </Link>
        <Link
          to={ROUTES.LOST_FOUND.LIST}
          className="flex flex-col items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl py-4 px-2 hover:bg-amber-100 transition-colors"
        >
          <span className="text-3xl">🔍</span>
          <span className="text-xs font-semibold text-amber-700 text-center">Achados e Perdidos</span>
        </Link>
        <Link
          to={ROUTES.SERVICES.LIST}
          className="flex flex-col items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl py-4 px-2 hover:bg-blue-100 transition-colors"
        >
          <span className="text-3xl">🏥</span>
          <span className="text-xs font-semibold text-blue-700 text-center">Serviços</span>
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto divide-y divide-gray-100">
        {/* Adoption carousel */}
        <CarouselSection
          title="Adoção"
          emoji="❤️"
          viewAllTo={ROUTES.ADOPTION.LIST}
          accentClass="bg-pink-100"
          isEmpty={adoptions.length === 0}
          emptyMessage="Nenhum pet disponível no momento."
        >
          <ul className="flex gap-3 w-max [&>li]:w-48 [&>li]:shrink-0">
            {adoptions.map((listing) => (
              <AdoptionCard key={listing.id} listing={listing} />
            ))}
          </ul>
        </CarouselSection>

        {/* Lost & found carousel */}
        <CarouselSection
          title="Achados e Perdidos"
          emoji="🔍"
          viewAllTo={ROUTES.LOST_FOUND.LIST}
          accentClass="bg-amber-100"
          isEmpty={reports.length === 0}
          emptyMessage="Nenhum relatório aberto no momento."
        >
          <ul className="flex gap-3 w-max [&>li]:w-72 [&>li]:shrink-0">
            {reports.map((report) => (
              <LostFoundCard key={report.id} report={report} />
            ))}
          </ul>
        </CarouselSection>

        {/* Services carousel */}
        <CarouselSection
          title="Serviços"
          emoji="🏥"
          viewAllTo={ROUTES.SERVICES.LIST}
          accentClass="bg-blue-100"
          isEmpty={services.length === 0}
          emptyMessage="Nenhum serviço cadastrado no momento."
        >
          <ul className="flex gap-3 w-max">
            {services.map((service) => (
              <li key={service.id} className="w-64 shrink-0">
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </CarouselSection>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-6 pb-24 lg:pb-6">
        PetHUB — Cuidar de quem você ama 🐾
      </footer>
    </PublicLayout>
  )
}
