/**
 * @module organization
 * @file OrganizationDetailPage.tsx
 * @description Page for viewing organization details, member list, and role-based actions.
 */

import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ROUTES } from '@/routes/routes.config'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { useOrganization } from '@/modules/organization/hooks/useOrganization'
import { applyCnpjMask } from '@/shared/utils/mask'
import CpfInput from '@/shared/components/forms/CpfInput'
import { validateCpf } from '@/shared/validators/cpf.validator'
import type { OrgRole } from '@/modules/organization/types'
import type { ApiError } from '@/shared/types'

const TYPE_LABELS: Record<string, string> = {
  COMPANY: 'Empresa',
  NGO: 'ONG',
}

const ROLE_LABELS: Record<OrgRole, string> = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
}

const ROLE_COLORS: Record<OrgRole, string> = {
  OWNER: 'bg-yellow-100 text-yellow-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  MEMBER: 'bg-gray-100 text-gray-700',
}

const addMemberSchema = z.object({
  cpf: z.string().min(1, 'CPF é obrigatório').refine(validateCpf, 'CPF inválido'),
  role: z.enum(['OWNER', 'MANAGER', 'MEMBER']),
})
type AddMemberForm = z.infer<typeof addMemberSchema>

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    organization,
    members,
    isLoading,
    error,
    getOrganization,
    getMembers,
    uploadOrgPhoto,
    addMember,
    removeMember,
    changeRole,
    deleteOrganization,
  } = useOrganization()
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [addMemberError, setAddMemberError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const canEditPhoto = organization?.myRole === 'OWNER' || organization?.myRole === 'MANAGER'
  const isOwner = organization?.myRole === 'OWNER'

  const { control, register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { cpf: '', role: 'MEMBER' },
  })

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && id) {
      await uploadOrgPhoto(id, file)
    }
  }

  const onAddMember = async (data: AddMemberForm) => {
    if (!id) return
    setAddMemberError(null)
    try {
      await addMember(id, data.cpf, data.role as OrgRole)
      reset()
      await getMembers(id)
    } catch (err) {
      const apiError = err as ApiError
      setAddMemberError(apiError.message ?? 'Erro ao adicionar membro.')
    }
  }

  const handleRemoveMember = async (personId: string) => {
    if (!id) return
    try {
      await removeMember(id, personId)
      await getMembers(id)
    } catch {
      // error displayed via hook's error state
    }
  }

  const handleDelete = async () => {
    if (!id) return
    await deleteOrganization(id)
    navigate(ROUTES.ORGANIZATION.LIST)
  }

  const handleChangeRole = async (personId: string, role: OrgRole) => {
    if (!id) return
    try {
      await changeRole(id, personId, role)
      await getMembers(id)
    } catch {
      // error displayed via hook's error state
    }
  }

  useEffect(() => {
    if (id) {
      getOrganization(id)
      getMembers(id)
    }
  }, [id])

  return (
    <AppShell>
      <Header title="Organização" />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        {organization && (
          <div className="flex flex-col gap-4">
            {/* Org info card */}
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <div className="flex items-start gap-3 mb-3">
                {organization.photoUrl ? (
                  <img
                    src={organization.photoUrl}
                    alt={organization.name}
                    className="w-20 h-20 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-gray-500">
                      {organization.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {canEditPhoto && (
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="text-sm font-medium text-[--color-primary] hover:underline"
                    >
                      Alterar foto
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{organization.name}</p>
              <p className="text-sm text-gray-500">{TYPE_LABELS[organization.type]}</p>
              {organization.cnpj && (
                <p className="text-sm text-gray-500 mt-1">
                  CNPJ: {applyCnpjMask(organization.cnpj)}
                </p>
              )}
              {organization.email && (
                <p className="text-sm text-gray-500">{organization.email}</p>
              )}
              {organization.phone && (
                <p className="text-sm text-gray-500">{organization.phone}</p>
              )}
              {organization.description && (
                <p className="text-sm text-gray-700 mt-2">{organization.description}</p>
              )}
            </div>

            {/* Members section */}
            <div className="bg-white rounded-[--radius-lg] border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Membros</p>

              {members.length > 0 ? (
                <ul className="flex flex-col gap-2 mb-4">
                  {members.map((member) => (
                    <li key={member.personId} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-800 truncate">{member.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {isOwner ? (
                          <>
                            <select
                              value={member.role}
                              onChange={(e) => handleChangeRole(member.personId, e.target.value as OrgRole)}
                              className="text-xs border border-gray-300 rounded px-1 py-0.5"
                              aria-label={`Papel de ${member.name}`}
                            >
                              <option value="OWNER">OWNER</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="MEMBER">MEMBER</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.personId)}
                              className="text-xs text-[--color-danger] hover:underline"
                              aria-label={`Remover ${member.name}`}
                            >
                              Remover
                            </button>
                          </>
                        ) : (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[member.role as OrgRole]}`}>
                            {ROLE_LABELS[member.role as OrgRole]}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 mb-3">Nenhum membro cadastrado.</p>
              )}

              {/* Add member form — OWNER only */}
              {isOwner && (
                <form
                  onSubmit={handleSubmit(onAddMember)}
                  className="flex flex-col gap-2 pt-3 border-t border-gray-100"
                  aria-label="Adicionar membro"
                >
                  <p className="text-xs font-medium text-gray-600">Adicionar membro</p>
                  <CpfInput name="cpf" label="CPF" control={control} required />
                  <div className="flex flex-col gap-1">
                    <label htmlFor="role" className="text-sm font-medium text-gray-700">Papel</label>
                    <select
                      id="role"
                      {...register('role')}
                      className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="OWNER">OWNER</option>
                    </select>
                  </div>
                  {addMemberError && (
                    <p role="alert" className="text-sm text-[--color-danger]">{addMemberError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] bg-[--color-primary] text-white font-medium rounded-[--radius-md] text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                  </button>
                </form>
              )}
            </div>

            {/* Member actions */}
            {organization.myRole && (
              <Link
                to={ROUTES.ORGANIZATION.DASHBOARD(organization.id)}
                className="text-sm font-medium text-[--color-primary] hover:underline"
              >
                Gerenciar
              </Link>
            )}

            {/* OWNER-only actions */}
            {isOwner && (
              <Link
                to={ROUTES.ORGANIZATION.EDIT(organization.id)}
                className="text-sm font-medium text-[--color-primary] hover:underline"
              >
                Editar organização
              </Link>
            )}

            {isOwner && (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="text-sm font-medium text-[--color-danger] hover:underline self-start"
                  >
                    Excluir organização
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-700">Tem certeza? Esta ação não pode ser desfeita.</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="min-h-[44px] px-4 bg-[--color-danger] text-white text-sm font-medium rounded-[--radius-md]"
                      >
                        Confirmar exclusão
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="min-h-[44px] px-4 border border-gray-300 text-sm font-medium rounded-[--radius-md] text-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}
