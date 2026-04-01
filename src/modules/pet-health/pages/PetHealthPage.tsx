/**
 * @module pet-health
 * @file PetHealthPage.tsx
 * @description Page showing a pet's health records: vaccinations and exam files, tabbed.
 */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppShell from '@/shared/components/layout/AppShell'
import Header from '@/shared/components/layout/Header'
import PageWrapper from '@/shared/components/layout/PageWrapper'
import { usePetHealth } from '@/modules/pet-health/hooks/usePetHealth'
import VaccinationCard from '@/modules/pet-health/components/VaccinationCard'
import VaccinationForm from '@/modules/pet-health/components/VaccinationForm'
import ExamFileList from '@/modules/pet-health/components/ExamFileList'
import type { UploadExamData } from '@/modules/pet-health/types'

type Tab = 'vaccinations' | 'exams'

export default function PetHealthPage() {
  const { id: petId } = useParams<{ id: string }>()
  const { vaccinations, examFiles, isLoading, error, listVaccinations, createVaccination, listExamFiles, uploadExamFile, deleteExamFile } = usePetHealth()
  const [activeTab, setActiveTab] = useState<Tab>('vaccinations')
  const [showVaccinationForm, setShowVaccinationForm] = useState(false)

  useEffect(() => {
    if (petId) {
      listVaccinations(petId)
      listExamFiles(petId)
    }
  }, [petId])

  const handleUpload = async (data: UploadExamData) => {
    if (petId) await uploadExamFile(petId, data)
  }

  const handleDeleteExam = async (examId: string) => {
    if (petId) await deleteExamFile(petId, examId)
  }

  return (
    <AppShell>
      <Header title="Saúde do Pet" />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('vaccinations')}
            className={[
              'px-4 py-2 text-sm font-medium',
              activeTab === 'vaccinations'
                ? 'border-b-2 border-[--color-primary] text-[--color-primary]'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            Vacinas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={[
              'px-4 py-2 text-sm font-medium',
              activeTab === 'exams'
                ? 'border-b-2 border-[--color-primary] text-[--color-primary]'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            Exames
          </button>
        </div>

        {activeTab === 'vaccinations' && (
          <div className="flex flex-col gap-4">
            <VaccinationCard vaccinations={vaccinations} />
            {!showVaccinationForm ? (
              <button
                type="button"
                onClick={() => setShowVaccinationForm(true)}
                className="text-sm text-[--color-primary] hover:underline text-left"
              >
                + Registrar vacina
              </button>
            ) : (
              <VaccinationForm
                isLoading={isLoading}
                onSubmit={async (data) => {
                  if (petId) {
                    await createVaccination(petId, data)
                    setShowVaccinationForm(false)
                  }
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <ExamFileList
            examFiles={examFiles}
            onUpload={handleUpload}
            onDelete={handleDeleteExam}
            isUploading={isLoading}
          />
        )}
      </PageWrapper>
    </AppShell>
  )
}
