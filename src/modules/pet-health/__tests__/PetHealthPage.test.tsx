/**
 * @module pet-health
 * @file __tests__/PetHealthPage.test.tsx
 * @description Tests for PetHealthPage — tab navigation, delete handlers, form toggle.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import PetHealthPage from '@/modules/pet-health/pages/PetHealthPage'

// ─── Layout mocks ─────────────────────────────────────────────────────────────

jest.mock('@/shared/components/layout/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/shared/components/layout/Header', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('@/shared/components/layout/PageWrapper', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// ─── react-router-dom ─────────────────────────────────────────────────────────

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'pet-1' }),
}))

// ─── Child component mocks ────────────────────────────────────────────────────

jest.mock('@/modules/pet-health/components/VaccinationCard', () => ({
  default: ({
    onDelete,
  }: {
    vaccinations: unknown[]
    onDelete?: (id: string) => Promise<void>
  }) => (
    <div>
      <p>VaccinationCard</p>
      {onDelete && (
        <button type="button" onClick={() => onDelete('vac-1')}>
          trigger-delete-vaccination
        </button>
      )}
    </div>
  ),
}))

jest.mock('@/modules/pet-health/components/VaccinationForm', () => ({
  default: ({
    onSubmit,
  }: {
    onSubmit: (data: unknown) => Promise<void>
    isLoading?: boolean
  }) => (
    <div>
      <p>VaccinationForm</p>
      <button
        type="button"
        onClick={() => onSubmit({ vaccineName: 'Antirrábica', applicationDate: '2026-01-01' })}
      >
        submit-vaccination
      </button>
    </div>
  ),
}))

jest.mock('@/modules/pet-health/components/ExamFileList', () => ({
  default: ({
    onDelete,
  }: {
    examFiles: unknown[]
    onUpload: (data: unknown) => Promise<void>
    onDelete?: (id: string) => Promise<void>
    isUploading?: boolean
  }) => (
    <div>
      <p>ExamFileList</p>
      {onDelete && (
        <button type="button" onClick={() => onDelete('exam-1')}>
          trigger-delete-exam
        </button>
      )}
    </div>
  ),
}))

// ─── Hook mock ────────────────────────────────────────────────────────────────

const mockListVaccinations = jest.fn()
const mockCreateVaccination = jest.fn()
const mockDeleteVaccination = jest.fn()
const mockListExamFiles = jest.fn()
const mockUploadExamFile = jest.fn()
const mockDeleteExamFile = jest.fn()

const hookState = {
  vaccinations: [] as unknown[],
  examFiles: [] as unknown[],
  isLoading: false,
  error: null as string | null,
}

jest.mock('@/modules/pet-health/hooks/usePetHealth', () => ({
  usePetHealth: () => ({
    vaccinations: hookState.vaccinations,
    examFiles: hookState.examFiles,
    isLoading: hookState.isLoading,
    error: hookState.error,
    listVaccinations: mockListVaccinations,
    createVaccination: mockCreateVaccination,
    deleteVaccination: mockDeleteVaccination,
    listExamFiles: mockListExamFiles,
    uploadExamFile: mockUploadExamFile,
    deleteExamFile: mockDeleteExamFile,
  }),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderPage = () =>
  render(
    <MemoryRouter>
      <PetHealthPage />
    </MemoryRouter>,
  )

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PetHealthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    hookState.vaccinations = []
    hookState.examFiles = []
    hookState.isLoading = false
    hookState.error = null
    mockListVaccinations.mockResolvedValue(undefined)
    mockListExamFiles.mockResolvedValue(undefined)
    mockCreateVaccination.mockResolvedValue(undefined)
    mockDeleteVaccination.mockResolvedValue(undefined)
    mockDeleteExamFile.mockResolvedValue(undefined)
  })

  it('should render the page title', () => {
    renderPage()
    expect(screen.getByText('Saúde do Pet')).toBeInTheDocument()
  })

  it('should load vaccinations and exam files on mount', () => {
    renderPage()
    expect(mockListVaccinations).toHaveBeenCalledWith('pet-1')
    expect(mockListExamFiles).toHaveBeenCalledWith('pet-1')
  })

  it('should show VaccinationCard in vaccinations tab by default', () => {
    renderPage()
    expect(screen.getByText('VaccinationCard')).toBeInTheDocument()
    expect(screen.queryByText('ExamFileList')).not.toBeInTheDocument()
  })

  it('should switch to exams tab when Exames tab is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /exames/i }))
    expect(screen.getByText('ExamFileList')).toBeInTheDocument()
    expect(screen.queryByText('VaccinationCard')).not.toBeInTheDocument()
  })

  it('should show loading indicator when isLoading is true', () => {
    hookState.isLoading = true
    renderPage()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('should show error message when error is set', () => {
    hookState.error = 'Erro de rede.'
    renderPage()
    expect(screen.getByRole('alert')).toHaveTextContent('Erro de rede.')
  })

  it('should show "+ Registrar vacina" button in vaccinations tab', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /registrar vacina/i })).toBeInTheDocument()
  })

  it('should toggle VaccinationForm when "+ Registrar vacina" is clicked', async () => {
    renderPage()
    expect(screen.queryByText('VaccinationForm')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /registrar vacina/i }))
    expect(screen.getByText('VaccinationForm')).toBeInTheDocument()
  })

  it('should call createVaccination and hide form when VaccinationForm submits', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /registrar vacina/i }))
    await userEvent.click(screen.getByRole('button', { name: /submit-vaccination/i }))
    expect(mockCreateVaccination).toHaveBeenCalledWith('pet-1', {
      vaccineName: 'Antirrábica',
      applicationDate: '2026-01-01',
    })
    expect(screen.queryByText('VaccinationForm')).not.toBeInTheDocument()
  })

  it('should call deleteVaccination when VaccinationCard triggers onDelete', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /trigger-delete-vaccination/i }))
    expect(mockDeleteVaccination).toHaveBeenCalledWith('pet-1', 'vac-1')
  })

  it('should call deleteExamFile when ExamFileList triggers onDelete', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /exames/i }))
    await userEvent.click(screen.getByRole('button', { name: /trigger-delete-exam/i }))
    expect(mockDeleteExamFile).toHaveBeenCalledWith('pet-1', 'exam-1')
  })
})
