import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import { usePet } from '@/modules/pet/hooks/usePet'
import Icon from '@/shared/components/ui/Icon'

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Cão', cat: 'Gato', bird: 'Ave', rabbit: 'Coelho', other: 'Outro',
}

export default function PetListPage() {
  const { pets, isLoading, error, listPets } = usePet()

  useEffect(() => {
    listPets()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="font-fraunces font-black text-4xl text-ink tracking-tight leading-tight">
              Meus Pets
            </h1>
            {pets.length > 0 && (
              <p className="text-sm text-muted mt-1.5">
                {pets.length} pet{pets.length > 1 ? 's' : ''} cadastrado{pets.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Link
            to={ROUTES.PET.CREATE}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-green text-white hover:opacity-90 transition-opacity"
          >
            <Icon name="plus" size={14} color="#fff" /> Novo pet
          </Link>
        </div>

        {isLoading && <p className="text-sm text-muted">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-red">{error}</p>}

        {!isLoading && !error && pets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-soft flex items-center justify-center mx-auto mb-4">
              <Icon name="paw" size={32} color="var(--muted)" />
            </div>
            <p className="text-body font-semibold">Nenhum pet encontrado.</p>
            <p className="text-sm text-muted mt-1">Cadastre seu primeiro pet para começar.</p>
            <Link
              to={ROUTES.PET.CREATE}
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2.5 rounded-xl font-semibold text-sm bg-green text-white hover:opacity-90 transition-opacity"
            >
              <Icon name="plus" size={14} color="#fff" /> Cadastrar pet
            </Link>
          </div>
        )}

        {/* Grid */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pets.map((pet) => (
            <li key={pet.id}>
              <Link
                to={ROUTES.PET.DETAIL(pet.id)}
                className="group block bg-card rounded-2xl border border-line overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
              >
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 flex items-center justify-center" style={{ background: 'var(--soft)' }}>
                    <Icon name="paw" size={40} color="var(--muted)" />
                  </div>
                )}
                <div className="p-4">
                  <p className="font-bold text-body">{pet.name}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {SPECIES_LABELS[pet.species] ?? pet.species}
                    {pet.breed ? ` · ${pet.breed}` : ''}
                    {pet.gender === 'M' ? ' · Macho' : pet.gender === 'F' ? ' · Fêmea' : ''}
                    {pet.castrated === true ? ' · Castrado(a)' : ''}
                  </p>
                </div>
              </Link>
            </li>
          ))}

          {/* Add card */}
          {!isLoading && (
            <li>
              <Link
                to={ROUTES.PET.CREATE}
                className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-line-strong min-h-[180px] hover:border-green hover:bg-green-light transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center group-hover:bg-green transition-colors">
                  <Icon name="plus" size={20} color="var(--green)" />
                </div>
                <span className="text-sm font-semibold text-muted group-hover:text-green transition-colors">
                  Cadastrar pet
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </AppShell>
  )
}
