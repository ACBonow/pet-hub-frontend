/**
 * @module pet-health
 * @file ExamUploadForm.tsx
 * @description Standalone form for uploading exam files.
 */

import { useState } from 'react'
import Button from '@/shared/components/ui/Button'
import type { UploadExamData } from '@/modules/pet-health/types'

interface ExamUploadFormProps {
  onSubmit: (data: UploadExamData) => Promise<void>
  isLoading?: boolean
}

export default function ExamUploadForm({ onSubmit, isLoading }: ExamUploadFormProps) {
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
      await onSubmit({ name, examDate, file })
    } catch (err) {
      const apiErr = err as { message?: string }
      setError(apiErr.message ?? 'Erro ao enviar exame.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="upload-name" className="text-sm font-medium text-gray-700">
          Nome do exame
        </label>
        <input
          id="upload-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="upload-date" className="text-sm font-medium text-gray-700">
          Data do exame
        </label>
        <input
          id="upload-date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-[--radius-md] text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="upload-file" className="text-sm font-medium text-gray-700">
          Arquivo
        </label>
        <input
          id="upload-file"
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
      </div>

      {error && <p role="alert" className="text-xs text-[--color-danger]">{error}</p>}

      <Button type="submit" loading={isLoading}>
        Enviar exame
      </Button>
    </form>
  )
}
