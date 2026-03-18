/**
 * @module pet
 * @file TutorshipTransfer.tsx
 * @description Component for transferring pet tutorship with a confirmation modal.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/shared/components/ui/Button'
import type { TutorshipType, TransferTutorshipData } from '@/modules/pet/types'

interface TutorshipTransferProps {
  petId: string
  onTransfer: (data: TransferTutorshipData) => Promise<void>
}

interface TransferFormValues {
  newTutorId: string
  tutorshipType: TutorshipType
}

export default function TutorshipTransfer({ onTransfer }: TutorshipTransferProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transferError, setTransferError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferFormValues>({
    defaultValues: { newTutorId: '', tutorshipType: 'TUTOR' },
  })

  const openModal = () => {
    reset()
    setTransferError(null)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setTransferError(null)
  }

  const handleConfirm = async (data: TransferFormValues) => {
    setIsSubmitting(true)
    setTransferError(null)
    try {
      await onTransfer(data)
      setIsOpen(false)
    } catch (err) {
      const error = err as { message?: string }
      setTransferError(error.message ?? 'Erro ao transferir tutoria.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={openModal}>
        Transferir Tutoria
      </Button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="bg-white rounded-[--radius-lg] w-full max-w-sm p-6 flex flex-col gap-4">
            <h2 id="transfer-modal-title" className="text-lg font-semibold text-gray-900">
              Confirmar Transferência
            </h2>

            <form onSubmit={handleSubmit(handleConfirm)} noValidate>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="newTutorId" className="text-sm font-medium text-gray-700">
                    ID do Novo Tutor
                  </label>
                  <input
                    id="newTutorId"
                    type="text"
                    {...register('newTutorId', { required: 'ID do novo tutor é obrigatório' })}
                    className={[
                      'w-full min-h-[44px] px-3 py-2',
                      'border rounded-[--radius-md] text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-[--color-primary]',
                      errors.newTutorId ? 'border-[--color-danger]' : 'border-gray-300',
                    ].join(' ')}
                  />
                  {errors.newTutorId && (
                    <p role="alert" className="text-xs text-[--color-danger]">
                      {errors.newTutorId.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="tutorshipType" className="text-sm font-medium text-gray-700">
                    Tipo de Tutoria
                  </label>
                  <select
                    id="tutorshipType"
                    {...register('tutorshipType')}
                    className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  >
                    <option value="OWNER">Dono</option>
                    <option value="TUTOR">Tutor</option>
                    <option value="TEMPORARY_HOME">Lar Temporário</option>
                  </select>
                </div>

                {transferError && (
                  <p role="alert" className="text-sm text-[--color-danger]">
                    {transferError}
                  </p>
                )}

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
