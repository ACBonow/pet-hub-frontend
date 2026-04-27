import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import PublicLayout from '@/shared/components/layout/PublicLayout'
import ContactGate from '@/shared/components/ui/ContactGate'
import Chip from '@/shared/components/ui/Chip'
import Icon from '@/shared/components/ui/Icon'
import { useServicesDirectory } from '@/modules/services-directory/hooks/useServicesDirectory'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { ROUTES } from '@/routes/routes.config'

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { service, isLoading, error, getService, uploadServicePhoto, deleteService } = useServicesDirectory()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isOwner = !!user && !!service && user.id === service.createdByUserId

  const handleDelete = async () => {
    if (!service) return
    await deleteService(service.id)
    navigate(ROUTES.SERVICES.LIST)
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && service) {
      await uploadServicePhoto(service.id, file)
      getService(service.id)
    }
  }

  useEffect(() => {
    if (id) getService(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const addressParts = service
    ? [
        service.street && service.number ? `${service.street}, ${service.number}` : service.street,
        service.complement,
        service.neighborhood,
        service.city && service.state ? `${service.city} — ${service.state}` : service.city || service.state,
        service.zipCode ? `CEP ${service.zipCode}` : null,
      ].filter(Boolean)
    : []
  const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : null

  const hasSocialLinks = service && (
    service.website || service.instagram || service.facebook ||
    service.tiktok || service.youtube || service.googleBusinessUrl
  )

  return (
    <PublicLayout>
      <div className="px-4 py-6 lg:px-8 lg:py-7 pb-12 max-w-[1400px]">

        {/* Back */}
        <Link
          to={ROUTES.SERVICES.LIST}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-body transition-colors mb-6"
        >
          <Icon name="arrow" size={14} color="currentColor" className="rotate-180" />
          Voltar para Marketplace
        </Link>

        {isLoading && <p className="text-sm text-muted">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-red">{error}</p>}

        {service && (
          <>
            {/* Hero photo */}
            {service.photoUrl ? (
              <img
                src={service.photoUrl}
                alt={service.name}
                className="w-full h-[280px] object-cover rounded-2xl border border-line mb-6"
              />
            ) : (
              <div
                className="w-full h-[200px] rounded-2xl border border-line mb-6 flex items-center justify-center"
                style={{ background: 'repeating-linear-gradient(135deg, var(--soft), var(--soft) 8px, var(--line) 8px, var(--line) 16px)' }}
              >
                <Icon name="stethoscope" size={56} color="var(--muted)" />
              </div>
            )}

            {/* Owner controls */}
            {isOwner && (
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  aria-label="Alterar foto do serviço"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-green hover:underline flex items-center gap-1"
                >
                  <Icon name="image" size={13} color="var(--green)" /> Alterar foto
                </button>
                <Link
                  to={ROUTES.SERVICES.EDIT(service.id)}
                  className="text-sm font-medium text-green hover:underline flex items-center gap-1"
                >
                  <Icon name="edit" size={13} color="var(--green)" /> Editar
                </Link>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-sm font-medium text-red hover:underline"
                  >
                    Excluir
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="text-sm font-medium text-white bg-red px-2.5 py-1 rounded-lg disabled:opacity-50"
                    >
                      Confirmar exclusão
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-sm text-muted hover:underline"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 svc-detail-grid">

              {/* Content */}
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Chip color="var(--info)">{service.serviceType.label}</Chip>
                  </div>
                  <h1 className="font-fraunces font-black text-4xl text-ink leading-tight tracking-tight">
                    {service.name}
                  </h1>
                  {service.description && (
                    <p className="text-sm text-body mt-4 leading-relaxed">{service.description}</p>
                  )}
                </div>

                {/* Contact */}
                <div className="bg-card border border-line rounded-2xl p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Contato</p>
                  <div className="flex flex-col gap-3">
                    {fullAddress && (
                      <div className="flex items-start gap-2">
                        <Icon name="pin" size={15} color="var(--muted)" className="shrink-0 mt-0.5" />
                        <ContactGate value={fullAddress} />
                      </div>
                    )}
                    {service.googleMapsUrl && (
                      <a
                        href={service.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-green hover:underline flex items-center gap-1"
                      >
                        Ver no Google Maps <Icon name="arrow" size={11} color="var(--green)" />
                      </a>
                    )}
                    {service.phone && (
                      <div className="flex items-center gap-2">
                        <Icon name="chat" size={15} color="var(--muted)" />
                        <ContactGate
                          value={service.phone}
                          href={`tel:${service.phone}`}
                        />
                      </div>
                    )}
                    {service.whatsapp && (
                      <div className="flex items-center gap-2">
                        <Icon name="chat" size={15} color="var(--green)" />
                        <ContactGate
                          value={`WhatsApp: ${service.whatsapp}`}
                          href={`https://wa.me/55${service.whatsapp.replace(/\D/g, '')}`}
                        />
                      </div>
                    )}
                    {service.email && (
                      <div className="flex items-center gap-2">
                        <Icon name="share" size={15} color="var(--muted)" />
                        <ContactGate
                          value={service.email}
                          href={`mailto:${service.email}`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Social links */}
                {hasSocialLinks && (
                  <div className="bg-card border border-line rounded-2xl p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Redes sociais e links</p>
                    <div className="flex flex-col gap-2.5">
                      {service.website && (
                        <a href={service.website} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-green hover:underline flex items-center gap-1.5">
                          <Icon name="share" size={14} color="var(--green)" /> Website
                        </a>
                      )}
                      {service.instagram && (
                        <a href={service.instagram.startsWith('http') ? service.instagram : `https://instagram.com/${service.instagram.replace('@', '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-green hover:underline flex items-center gap-1.5">
                          <Icon name="share" size={14} color="var(--green)" /> Instagram
                        </a>
                      )}
                      {service.facebook && (
                        <a href={service.facebook.startsWith('http') ? service.facebook : `https://facebook.com/${service.facebook}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-green hover:underline flex items-center gap-1.5">
                          <Icon name="share" size={14} color="var(--green)" /> Facebook
                        </a>
                      )}
                      {service.tiktok && (
                        <a href={service.tiktok.startsWith('http') ? service.tiktok : `https://tiktok.com/@${service.tiktok.replace('@', '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-green hover:underline flex items-center gap-1.5">
                          <Icon name="share" size={14} color="var(--green)" /> TikTok
                        </a>
                      )}
                      {service.youtube && (
                        <a href={service.youtube} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-green hover:underline flex items-center gap-1.5">
                          <Icon name="share" size={14} color="var(--green)" /> YouTube
                        </a>
                      )}
                      {service.googleBusinessUrl && (
                        <a href={service.googleBusinessUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-green hover:underline flex items-center gap-1.5">
                          <Icon name="pin" size={14} color="var(--green)" /> Google Meu Negócio
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky info panel */}
              <div>
                <div className="bg-card border border-line rounded-2xl p-5 lg:sticky lg:top-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">Informações</p>

                  {fullAddress && (
                    <div className="flex gap-2.5 py-3 border-b border-line">
                      <Icon name="pin" size={16} color="var(--muted)" className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Endereço</p>
                        <ContactGate value={fullAddress} />
                      </div>
                    </div>
                  )}

                  {service.phone && (
                    <div className="flex gap-2.5 py-3 border-b border-line">
                      <Icon name="chat" size={16} color="var(--muted)" className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Telefone</p>
                        <ContactGate value={service.phone} href={`tel:${service.phone}`} />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5 mt-4">
                    <button className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-green text-white hover:opacity-90 transition-opacity">
                      <Icon name="calendar" size={15} color="#fff" /> Agendar visita
                    </button>
                    <button className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm border border-line text-body hover:bg-soft transition-colors">
                      <Icon name="chat" size={14} color="currentColor" /> Conversar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`@media (max-width: 1024px) { .svc-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </PublicLayout>
  )
}
