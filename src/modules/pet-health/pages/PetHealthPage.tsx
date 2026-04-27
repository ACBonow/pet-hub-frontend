/**
 * @module pet-health
 * @file PetHealthPage.tsx
 * @description Page showing a pet's health records: vaccinations, vaccine status, preventives, and exams.
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
import VaccineStatusPanel from '@/modules/pet-health/components/VaccineStatusPanel'
import PreventiveList from '@/modules/pet-health/components/PreventiveList'
import PreventiveForm from '@/modules/pet-health/components/PreventiveForm'
import { listVaccineCatalogRequest } from '@/modules/pet-health/services/petHealth.service'
import type { CreatePreventiveData, UploadExamData, VaccineTemplate } from '@/modules/pet-health/types'

type Tab = 'vaccinations' | 'status' | 'preventives' | 'exams'

const TABS: { key: Tab; label: string }[] = [
  { key: 'vaccinations', label: 'Vacinas' },
  { key: 'status', label: 'Status Vacinal' },
  { key: 'preventives', label: 'Preventivos' },
  { key: 'exams', label: 'Exames' },
]

export default function PetHealthPage() {
  const { id: petId } = useParams<{ id: string }>()
  const {
    vaccinations,
    examFiles,
    vaccineStatus,
    preventives,
    isLoading,
    error,
    listVaccinations,
    createVaccination,
    deleteVaccination,
    listExamFiles,
    uploadExamFile,
    deleteExamFile,
    loadVaccineStatus,
    listPreventives,
    addPreventive,
    deletePreventive,
  } = usePetHealth()

  const [activeTab, setActiveTab] = useState<Tab>('vaccinations')
  const [showVaccinationForm, setShowVaccinationForm] = useState(false)
  const [showPreventiveForm, setShowPreventiveForm] = useState(false)
  const [catalogTemplates, setCatalogTemplates] = useState<VaccineTemplate[]>([])
  const [catalogLoading, setCatalogLoading] = useState(false)

  useEffect(() => {
    if (petId) {
      listVaccinations(petId)
      listExamFiles(petId)
      loadVaccineStatus(petId)
      listPreventives(petId)
    }
  }, [petId])

  useEffect(() => {
    setCatalogLoading(true)
    listVaccineCatalogRequest()
      .then(setCatalogTemplates)
      .catch(() => {})
      .finally(() => setCatalogLoading(false))
  }, [])

  const handleUpload = async (data: UploadExamData) => {
    if (petId) await uploadExamFile(petId, data)
  }

  const handleDeleteExam = async (examId: string) => {
    if (petId) await deleteExamFile(petId, examId)
  }

  const handleDeleteVaccination = async (vaccinationId: string) => {
    if (petId) await deleteVaccination(petId, vaccinationId)
  }

  const handleAddPreventive = async (data: CreatePreventiveData) => {
    if (petId) await addPreventive(petId, data)
    setShowPreventiveForm(false)
  }

  const handleDeletePreventive = async (id: string) => {
    if (petId) await deletePreventive(petId, id)
  }

  const vaccineCatalog = catalogTemplates.filter((t) => t.type === 'VACCINE')

  return (
    <AppShell>
      <Header title="Saúde do Pet" />
      <PageWrapper>
        {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p role="alert" className="text-sm text-[--color-danger]">{error}</p>}

        <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={[
                'px-4 py-2 text-sm font-medium whitespace-nowrap',
                activeTab === key
                  ? 'border-b-2 border-[--color-primary] text-[--color-primary]'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'vaccinations' && (
          <div className="flex flex-col gap-4">
            <VaccinationCard vaccinations={vaccinations} onDelete={handleDeleteVaccination} />
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
                catalogTemplates={vaccineCatalog}
                catalogLoading={catalogLoading}
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

        {activeTab === 'status' && (
          <VaccineStatusPanel entries={vaccineStatus} />
        )}

        {activeTab === 'preventives' && (
          <div className="flex flex-col gap-4">
            <PreventiveList records={preventives} onDelete={handleDeletePreventive} />
            {!showPreventiveForm ? (
              <button
                type="button"
                onClick={() => setShowPreventiveForm(true)}
                className="text-sm text-[--color-primary] hover:underline text-left"
              >
                + Registrar preventivo
              </button>
            ) : (
              <PreventiveForm
                isLoading={isLoading}
                catalogTemplates={catalogTemplates}
                onSubmit={handleAddPreventive}
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
