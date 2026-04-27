import type { TutorshipType } from '@/modules/pet/types'
import Icon from '@/shared/components/ui/Icon'
import Chip from '@/shared/components/ui/Chip'

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
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Tutor atual</p>
      <div className="bg-card border border-line rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center shrink-0">
          <Icon name="user" size={18} color="var(--green)" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-body truncate">{tutorName ?? tutorId}</p>
          <p className="text-xs text-muted">{TYPE_LABELS[tutorshipType]}</p>
        </div>
        <Chip color="var(--green)">atual</Chip>
      </div>
    </section>
  )
}
