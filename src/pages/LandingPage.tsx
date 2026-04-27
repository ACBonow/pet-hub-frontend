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
import Icon from '@/shared/components/ui/Icon'
import LogoMark from '@/shared/components/ui/LogoMark'
import type { AdoptionListing } from '@/modules/adoption/types'
import type { LostFoundReport } from '@/modules/lost-found/types'
import type { ServiceListing } from '@/modules/services-directory/types'
import { ROUTES } from '@/routes/routes.config'

const CAROUSEL_LIMIT = 6

interface SectionProps {
  title: string
  viewAllTo: string
  accentColor: string
  children: React.ReactNode
  isEmpty: boolean
  emptyMessage: string
}

function Section({ title, viewAllTo, accentColor, children, isEmpty, emptyMessage }: SectionProps) {
  return (
    <section className="py-7">
      <div className="flex items-center justify-between px-4 lg:px-8 mb-4">
        <h2 className="text-lg font-extrabold text-ink">{title}</h2>
        <Link
          to={viewAllTo}
          className="text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: accentColor }}
          aria-label={`Ver todos de ${title}`}
        >
          Ver todos <Icon name="arrow" size={13} color={accentColor} />
        </Link>
      </div>
      {isEmpty ? (
        <p className="px-4 lg:px-8 text-sm text-muted italic">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto px-4 lg:px-8 pb-2">
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
    listAdoptionsRequest({ status: 'AVAILABLE', pageSize: CAROUSEL_LIMIT })
      .then((result) => setAdoptions(result.data))
      .catch(() => {})

    listReportsRequest({ status: 'OPEN', pageSize: CAROUSEL_LIMIT })
      .then((result) => setReports(result.data))
      .catch(() => {})

    listServicesRequest({ pageSize: CAROUSEL_LIMIT })
      .then((data) => setServices(data?.data ?? []))
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PublicLayout>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 py-14 lg:py-20"
        style={{ background: 'linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)' }}
      >
        {/* Pampa grid texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" aria-hidden="true">
          <defs>
            <pattern id="pampa" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="transparent"/>
              <path d="M0 10 H20 M10 0 V20" stroke="#fff" strokeWidth="1"/>
              <rect x="0" y="0" width="10" height="10" fill="#fff"/>
              <rect x="10" y="10" width="10" height="10" fill="#fff"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pampa)"/>
        </svg>

        <div className="relative max-w-2xl mx-auto text-center text-white">
          <div className="flex justify-center mb-4">
            <LogoMark size={36} className="[&>span]:text-white [&>span:first-child]:text-yellow [&>span:nth-child(2)]:text-white/80 [&>span:last-child]:text-white/80" />
          </div>
          <h1 className="font-fraunces font-black text-4xl lg:text-5xl leading-tight tracking-tight mb-4">
            O lar digital<br />dos seus pets
          </h1>
          <p className="text-white/85 text-base lg:text-lg mb-8 leading-relaxed max-w-md mx-auto">
            Adote, encontre animais perdidos e conecte-se com clínicas, pet shops e ONGs da sua região.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={ROUTES.ADOPTION.LIST}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white text-green-dark hover:opacity-90 transition-opacity"
            >
              <Icon name="heart" size={16} color="var(--red)" /> Ver pets para adoção
            </Link>
            <Link
              to={isAuthenticated ? ROUTES.PET.CREATE : ROUTES.LOGIN}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 border-white/50 text-white hover:bg-white/10 transition-colors"
            >
              <Icon name="plus" size={16} color="#fff" /> Cadastrar meu pet
            </Link>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 px-4 lg:px-8 py-5 max-w-screen-xl mx-auto">
        {[
          { to: ROUTES.ADOPTION.LIST, icon: 'heart' as const, label: 'Adoção', color: 'var(--red)', bg: 'var(--green-light)' },
          { to: ROUTES.LOST_FOUND.LIST, icon: 'search' as const, label: 'Achados e Perdidos', color: 'var(--yellow-dark)', bg: '#FEF9E7' },
          { to: ROUTES.SERVICES.LIST, icon: 'stethoscope' as const, label: 'Serviços', color: 'var(--info)', bg: '#EBF5FB' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-2 rounded-2xl py-4 px-2 hover:opacity-90 transition-opacity border border-line"
            style={{ background: item.bg }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}18` }}>
              <Icon name={item.icon} size={20} color={item.color} />
            </div>
            <span className="text-xs font-semibold text-center text-body">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Sections */}
      <div className="max-w-screen-xl mx-auto divide-y divide-line">
        <Section
          title="Adoção"
          viewAllTo={ROUTES.ADOPTION.LIST}
          accentColor="var(--red)"
          isEmpty={adoptions.length === 0}
          emptyMessage="Nenhum pet disponível no momento."
        >
          <ul className="flex gap-3 w-max [&>li]:w-52 [&>li]:shrink-0">
            {adoptions.map((listing) => (
              <AdoptionCard key={listing.id} listing={listing} />
            ))}
          </ul>
        </Section>

        <Section
          title="Achados e Perdidos"
          viewAllTo={ROUTES.LOST_FOUND.LIST}
          accentColor="var(--yellow-dark)"
          isEmpty={reports.length === 0}
          emptyMessage="Nenhum relatório aberto no momento."
        >
          <ul className="flex gap-3 w-max [&>li]:w-72 [&>li]:shrink-0">
            {reports.map((report) => (
              <LostFoundCard key={report.id} report={report} />
            ))}
          </ul>
        </Section>

        <Section
          title="Serviços"
          viewAllTo={ROUTES.SERVICES.LIST}
          accentColor="var(--info)"
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
        </Section>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted py-6">
        Tchê PetHub — Cuidar de quem você ama 🐾
      </footer>
    </PublicLayout>
  )
}
