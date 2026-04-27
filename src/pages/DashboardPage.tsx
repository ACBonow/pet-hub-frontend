import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import { useAuthStore } from '@/modules/auth/store/authSlice'
import { usePet } from '@/modules/pet/hooks/usePet'
import Icon from '@/shared/components/ui/Icon'
import Chip from '@/shared/components/ui/Chip'
import { ROUTES } from '@/routes/routes.config'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão', cat: 'Gato', bird: 'Ave', rabbit: 'Coelho', other: 'Outro',
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const firstName = user?.name?.split(' ')[0] ?? 'tchê'
  const { pets, listPets } = usePet()

  useEffect(() => {
    listPets()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-7 lg:p-9 mb-7 text-white"
          style={{ background: 'linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%)' }}
        >
          {/* Pampa texture */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]" aria-hidden="true">
            <defs>
              <pattern id="hero-pampa" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M0 14 H28 M14 0 V28" stroke="#fff" strokeWidth="1"/>
                <rect x="0" y="0" width="14" height="14" fill="#fff"/>
                <rect x="14" y="14" width="14" height="14" fill="#fff"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pampa)"/>
          </svg>

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/85 font-medium">Bah, bom te ver de volta 👋</p>
              <h1 className="font-fraunces font-black text-3xl lg:text-4xl leading-tight tracking-tight mt-1">
                Oi, {firstName}
              </h1>
              <p className="text-white/85 text-sm mt-2 max-w-lg">
                {pets.length > 0
                  ? `Você tem ${pets.length} pet${pets.length > 1 ? 's' : ''} cadastrado${pets.length > 1 ? 's' : ''}. Tem ${pets.length > 1 ? 'deles' : 'dele'} aqui em baixo.`
                  : 'Cadastre seu primeiro pet e comece a gerenciar a saúde e tutoria.'}
              </p>
              <div className="flex flex-wrap gap-2.5 mt-5">
                <Link
                  to={ROUTES.PET.CREATE}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white text-green-dark hover:opacity-90 transition-opacity"
                >
                  <Icon name="plus" size={14} color="var(--green-dark)" /> Cadastrar pet
                </Link>
                <Link
                  to={ROUTES.ADOPTION.LIST}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm border border-white/40 text-white hover:bg-white/10 transition-colors"
                >
                  <Icon name="heart" size={14} color="#fff" /> Ver adoções
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2.5 shrink-0 w-full lg:w-auto lg:min-w-[260px]">
              {[
                { label: 'Meus pets', value: pets.length.toString(), highlight: true },
                { label: 'Em adoção', value: '—' },
                { label: 'Alertas na área', value: '—' },
                { label: 'Organizações', value: '—' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="px-4 py-3.5 rounded-xl border border-white/20"
                  style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}
                >
                  <p className="text-xl font-extrabold leading-none" style={{ color: s.highlight ? 'var(--yellow)' : '#fff' }}>
                    {s.value}
                  </p>
                  <p className="text-[11px] text-white/80 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

          {/* Left column */}
          <div className="flex flex-col gap-6">

            {/* Pets */}
            <section>
              <div className="flex items-baseline gap-3 justify-between mb-3">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-extrabold text-ink">Meus pets</h2>
                  {pets.length > 0 && (
                    <span className="text-xs text-muted">{pets.length}</span>
                  )}
                </div>
                {pets.length > 0 && (
                  <Link
                    to={ROUTES.PET.LIST}
                    className="text-xs font-semibold text-green flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    Ver todos <Icon name="arrow" size={11} color="var(--green)" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pets.slice(0, 5).map((pet) => (
                  <Link
                    key={pet.id}
                    to={ROUTES.PET.DETAIL(pet.id)}
                    className="group bg-card rounded-2xl border border-line overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
                  >
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={pet.name} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center" style={{ background: 'var(--soft)' }}>
                        <Icon name="paw" size={36} color="var(--muted)" />
                      </div>
                    )}
                    <div className="p-3.5">
                      <p className="font-bold text-body">{pet.name}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {SPECIES_LABELS[pet.species] ?? pet.species}
                        {pet.breed ? ` · ${pet.breed}` : ''}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* Add pet card */}
                <Link
                  to={ROUTES.PET.CREATE}
                  className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-line-strong min-h-[160px] hover:border-green hover:bg-green-light transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center group-hover:bg-green group-hover:text-white transition-colors">
                    <Icon name="plus" size={20} color="var(--green)" />
                  </div>
                  <span className="text-sm font-semibold text-muted group-hover:text-green transition-colors">
                    Cadastrar pet
                  </span>
                </Link>
              </div>
            </section>

            {/* Adoption highlight */}
            <div
              className="relative overflow-hidden rounded-2xl p-7"
              style={{ background: 'var(--yellow)', border: 'none' }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-[0.08]" aria-hidden="true">
                <defs>
                  <pattern id="adopt-pampa" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M0 10 H20 M10 0 V20" stroke="var(--green-dark)" strokeWidth="1"/>
                    <rect x="0" y="0" width="10" height="10" fill="var(--green-dark)"/>
                    <rect x="10" y="10" width="10" height="10" fill="var(--green-dark)"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#adopt-pampa)"/>
              </svg>
              <div className="relative">
                <Chip color="var(--red)" className="mb-3">ADOÇÃO · DESTAQUE</Chip>
                <h3 className="font-fraunces font-black text-2xl leading-tight text-ink tracking-tight">
                  Bah tchê, tem<br />um guri esperando por ti.
                </h3>
                <p className="text-sm text-ink/75 mt-2 max-w-sm">
                  Centenas de pets aguardam um lar na sua cidade. Cada adoção muda uma vida.
                </p>
                <Link
                  to={ROUTES.ADOPTION.LIST}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl font-semibold text-sm bg-green-dark text-white hover:opacity-90 transition-opacity"
                >
                  <Icon name="heart" size={14} color="#fff" /> Ver pets disponíveis
                </Link>
              </div>
            </div>

            {/* Quick access */}
            <section>
              <h2 className="text-lg font-extrabold text-ink mb-3">Acesso rápido</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { to: ROUTES.LOST_FOUND.LIST, icon: 'search' as const, label: 'Achados e Perdidos', color: 'var(--yellow-dark)', bg: '#FEF9E7' },
                  { to: ROUTES.SERVICES.LIST, icon: 'stethoscope' as const, label: 'Serviços', color: 'var(--info)', bg: '#EBF5FB' },
                  { to: ROUTES.ORGANIZATION.LIST, icon: 'building' as const, label: 'Organizações', color: 'var(--muted)', bg: 'var(--soft)' },
                  { to: ROUTES.PROFILE, icon: 'user' as const, label: 'Meu Perfil', color: 'var(--green)', bg: 'var(--green-light)' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-line hover:opacity-90 hover:-translate-y-0.5 transition-all"
                    style={{ background: item.bg }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
                      <Icon name={item.icon} size={20} color={item.color} />
                    </div>
                    <span className="text-xs font-semibold text-center text-body">{item.label}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">

            {/* Quick stats */}
            <div className="bg-card rounded-2xl border border-line p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Atalhos</p>
              {[
                { to: ROUTES.PET.LIST, icon: 'paw' as const, label: 'Meus Pets', color: 'var(--green)' },
                { to: ROUTES.ADOPTION.LIST, icon: 'heart' as const, label: 'Adoções', color: 'var(--red)' },
                { to: ROUTES.LOST_FOUND.LIST, icon: 'search' as const, label: 'Perdidos & Achados', color: 'var(--yellow-dark)' },
                { to: ROUTES.SERVICES.LIST, icon: 'stethoscope' as const, label: 'Marketplace', color: 'var(--info)' },
              ].map((item, i, arr) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 py-2.5 hover:opacity-75 transition-opacity ${i < arr.length - 1 ? 'border-b border-line' : ''}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}18` }}>
                    <Icon name={item.icon} size={16} color={item.color} />
                  </div>
                  <span className="text-sm font-medium text-body">{item.label}</span>
                  <Icon name="arrow" size={13} color="var(--muted)" className="ml-auto" />
                </Link>
              ))}
            </div>

            {/* Lost & found alert card */}
            <Link
              to={ROUTES.LOST_FOUND.LIST}
              className="bg-card rounded-2xl border-l-4 border border-red overflow-hidden hover:opacity-90 transition-opacity"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Chip color="var(--red)">🚨 Alertas na área</Chip>
                </div>
                <p className="text-sm text-body font-medium">Veja pets perdidos e encontrados perto de você</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-red">
                  Ver alertas <Icon name="arrow" size={12} color="var(--red)" />
                </div>
              </div>
            </Link>

            {/* Tip card */}
            <div className="bg-green-light rounded-2xl p-5 border border-transparent">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green mb-2">💡 Dica</p>
              <p className="text-sm text-body leading-relaxed">
                Mantenha a carteirinha de vacinação sempre atualizada. Acesse a saúde do pet pelo perfil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
