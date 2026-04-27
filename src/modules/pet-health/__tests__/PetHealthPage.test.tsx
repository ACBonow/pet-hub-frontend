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

// ─── Service mock ─────────────────────────────────────────────────────────────

jest.mock('@/modules/pet-health/services/petHealth.service', () => ({
  listVaccineCatalogRequest: jest.fn().mockResolvedValue([]),
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

jest.mock('@/modules/pet-health/components/VaccineStatusPanel', () => ({
  default: ({ entries }: { entries: unknown[] }) => (
    <div>
      <p>VaccineStatusPanel</p>
      <span data-testid="status-count">{entries.length}</span>
    </div>
  ),
}))

jest.mock('@/modules/pet-health/components/PreventiveList', () => ({
  default: ({
    records,
    onDelete,
  }: {
    records: unknown[]
    onDelete?: (id: string) => Promise<void>
  }) => (
    <div>
      <p>PreventiveList</p>
      <span data-testid="preventive-count">{records.length}</span>
      {onDelete && (
        <button type="button" onClick={() => onDelete('prev-1')}>
          trigger-delete-preventive
        </button>
      )}
    </div>
  ),
}))

jest.mock('@/modules/pet-health/components/PreventiveForm', () => ({
  default: ({
    onSubmit,
  }: {
    onSubmit: (data: unknown) => Promise<void>
    isLoading?: boolean
  }) => (
    <div>
      <p>PreventiveForm</p>
      <button
        type="button"
        onClick={() => onSubmit({ productName: 'Frontline', appliedAt: '2026-01-01' })}
      >
        submit-preventive
      </button>
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
const mockLoadVaccineStatus = jest.fn()
const mockListPreventives = jest.fn()
const mockAddPreventive = jest.fn()
const mockDeletePreventive = jest.fn()

const hookState = {
  vaccinations: [] as unknown[],
  examFiles: [] as unknown[],
  vaccineStatus: [] as unknown[],
  preventives: [] as unknown[],
  isLoading: false,
  error: null as string | null,
}

jest.mock('@/modules/pet-health/hooks/usePetHealth', () => ({
  usePetHealth: () => ({
    vaccinations: hookState.vaccinations,
    examFiles: hookState.examFiles,
    vaccineStatus: hookState.vaccineStatus,
    preventives: hookState.preventives,
    isLoading: hookState.isLoading,
    error: hookState.error,
    listVaccinations: mockListVaccinations,
    createVaccination: mockCreateVaccination,
    deleteVaccination: mockDeleteVaccination,
    listExamFiles: mockListExamFiles,
    uploadExamFile: mockUploadExamFile,
    deleteExamFile: mockDeleteExamFile,
    loadVaccineStatus: mockLoadVaccineStatus,
    listPreventives: mockListPreventives,
    addPreventive: mockAddPreventive,
    deletePreventive: mockDeletePreventive,
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
    hookState.vaccineStatus = []
    hookState.preventives = []
    hookState.isLoading = false
    hookState.error = null
    mockListVaccinations.mockResolvedValue(undefined)
    mockListExamFiles.mockResolvedValue(undefined)
    mockLoadVaccineStatus.mockResolvedValue(undefined)
    mockListPreventives.mockResolvedValue(undefined)
    mockCreateVaccination.mockResolvedValue(undefined)
    mockDeleteVaccination.mockResolvedValue(undefined)
    mockDeleteExamFile.mockResolvedValue(undefined)
    mockAddPreventive.mockResolvedValue(undefined)
    mockDeletePreventive.mockResolvedValue(undefined)
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

  it('should load vaccine status and preventives on mount', () => {
    renderPage()
    expect(mockLoadVaccineStatus).toHaveBeenCalledWith('pet-1')
    expect(mockListPreventives).toHaveBeenCalledWith('pet-1')
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

  it('should show VaccineStatusPanel in Status Vacinal tab', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /status vacinal/i }))
    expect(screen.getByText('VaccineStatusPanel')).toBeInTheDocument()
    expect(screen.queryByText('VaccinationCard')).not.toBeInTheDocument()
  })

  it('should show PreventiveList in Preventivos tab', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /preventivos/i }))
    expect(screen.getByText('PreventiveList')).toBeInTheDocument()
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

  it('should show "+ Registrar preventivo" in Preventivos tab', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /preventivos/i }))
    expect(screen.getByRole('button', { name: /registrar preventivo/i })).toBeInTheDocument()
  })

  it('should toggle PreventiveForm when "+ Registrar preventivo" is clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /preventivos/i }))
    expect(screen.queryByText('PreventiveForm')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /registrar preventivo/i }))
    expect(screen.getByText('PreventiveForm')).toBeInTheDocument()
  })

  it('should call addPreventive and hide form when PreventiveForm submits', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /preventivos/i }))
    await userEvent.click(screen.getByRole('button', { name: /registrar preventivo/i }))
    await userEvent.click(screen.getByRole('button', { name: /submit-preventive/i }))
    expect(mockAddPreventive).toHaveBeenCalledWith('pet-1', {
      productName: 'Frontline',
      appliedAt: '2026-01-01',
    })
    expect(screen.queryByText('PreventiveForm')).not.toBeInTheDocument()
  })

  it('should call deletePreventive when PreventiveList triggers onDelete', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /preventivos/i }))
    await userEvent.click(screen.getByRole('button', { name: /trigger-delete-preventive/i }))
    expect(mockDeletePreventive).toHaveBeenCalledWith('pet-1', 'prev-1')
  })
})
