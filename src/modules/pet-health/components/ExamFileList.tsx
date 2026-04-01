/**
 * @module pet-health
 * @file ExamFileList.tsx
 * @description Component listing exam files with an inline upload form.
 */

import { useState } from 'react'
import Button from '@/shared/components/ui/Button'
import type { ExamFile, UploadExamData } from '@/modules/pet-health/types'

interface ExamFileListProps {
  examFiles: ExamFile[]
  onUpload: (data: UploadExamData) => Promise<void>
  onDelete?: (examId: string) => Promise<void>
  isUploading?: boolean
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export default function ExamFileList({ examFiles, onUpload, onDelete, isUploading }: ExamFileListProps) {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      {examFiles.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum exame registrado.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {examFiles.map((exam) => (
            <li
              key={exam.id}
              className="flex items-center justify-between bg-white rounded-[--radius-md] border border-gray-200 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                <p className="text-xs text-gray-500">{formatDate(exam.examDate)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={exam.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[--color-primary] hover:underline"
                >
                  Ver
                </a>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(exam.id)}
                    aria-label={`Remover ${exam.name}`}
                    className="text-xs text-[--color-danger] hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!showUpload ? (
        <Button variant="secondary" onClick={() => setShowUpload(true)}>
          Enviar exame
        </Button>
      ) : (
        <ExamUploadInlineForm
          onUpload={onUpload}
          isUploading={isUploading}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}

interface ExamUploadInlineFormProps {
  onUpload: (data: UploadExamData) => Promise<void>
  isUploading?: boolean
  onCancel: () => void
}

function ExamUploadInlineForm({ onUpload, isUploading, onCancel }: ExamUploadInlineFormProps) {
  const [name, setName] = useState('')
  const [examDate, setExamDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Selecione um arquivo.')
      return
    }
    setError(null)
    try {
      await onUpload({ name, examDate, file })
      onCancel()
    } catch (err) {
      const apiErr = err as { message?: string }
      setError(apiErr.message ?? 'Erro ao enviar exame.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 p-3 bg-gray-50 rounded-[--radius-md] border border-gray-200">
      <div className="flex flex-col gap-1">
        <label htmlFor="exam-name" className="text-sm font-medium text-gray-700">
          Nome do exame
        </label>
        <input
          id="exam-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="exam-date" className="text-sm font-medium text-gray-700">
          Data do exame
        </label>
        <input
          id="exam-date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="exam-file" className="text-sm font-medium text-gray-700">
          Arquivo
        </label>
        <input
          id="exam-file"
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
      </div>

      {error && <p role="alert" className="text-xs text-[--color-danger]">{error}</p>}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={isUploading}>
          Enviar
        </Button>
      </div>
    </form>
  )
}
