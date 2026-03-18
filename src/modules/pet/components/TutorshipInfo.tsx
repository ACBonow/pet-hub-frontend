/**
 * @module pet
 * @file TutorshipInfo.tsx
 * @description Displays current tutorship information for a pet.
 */

import type { TutorshipType } from '@/modules/pet/types'

interface TutorshipInfoProps {
  tutorId: string
  tutorName?: string
  tutorshipType: TutorshipType
}

const TYPE_LABELS: Record<TutorshipType, string> = {
  OWNER: 'Dono',
  TUTOR: 'Tutor',
  TEMPORARY_HOME: 'Lar Temporário',
}

export default function TutorshipInfo({ tutorId, tutorName, tutorshipType }: TutorshipInfoProps) {
  return (
    <section aria-label="Tutoria atual">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Tutor Atual</h2>
      <div className="bg-gray-50 rounded-[--radius-md] px-3 py-2">
        <p className="text-sm font-medium text-gray-900">{tutorName ?? tutorId}</p>
        <p className="text-xs text-gray-500">{TYPE_LABELS[tutorshipType]}</p>
      </div>
    </section>
  )
}
