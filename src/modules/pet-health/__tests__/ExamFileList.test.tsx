/**
 * @module pet-health
 * @file ExamFileList.test.tsx
 * @description Tests for the ExamFileList component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ExamFileList from '@/modules/pet-health/components/ExamFileList'
import type { ExamFile } from '@/modules/pet-health/types'

const mockExamFiles: ExamFile[] = [
  {
    id: 'exam-1',
    petId: 'pet-1',
    examType: 'Hemograma Completo',
    fileUrl: 'https://storage.example.com/exams/hemograma.pdf',
    examDate: '2026-01-10',
    labName: null,
    notes: null,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'exam-2',
    petId: 'pet-1',
    examType: 'Raio-X Tórax',
    fileUrl: 'https://storage.example.com/exams/raio-x.png',
    examDate: '2026-02-20',
    labName: null,
    notes: null,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
]

const mockOnUpload = jest.fn()

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('ExamFileList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list exam files with examType and date', () => {
    renderWithRouter(<ExamFileList examFiles={mockExamFiles} onUpload={mockOnUpload} />)

    expect(screen.getByText('Hemograma Completo')).toBeInTheDocument()
    expect(screen.getByText('Raio-X Tórax')).toBeInTheDocument()
  })

  it('should render upload button', () => {
    renderWithRouter(<ExamFileList examFiles={mockExamFiles} onUpload={mockOnUpload} />)
    expect(screen.getByRole('button', { name: /enviar exame/i })).toBeInTheDocument()
  })

  it('should display empty message when no exam files', () => {
    renderWithRouter(<ExamFileList examFiles={[]} onUpload={mockOnUpload} />)
    expect(screen.getByText(/nenhum exame registrado/i)).toBeInTheDocument()
  })

  it('should show exam type input when upload button is clicked', async () => {
    renderWithRouter(<ExamFileList examFiles={[]} onUpload={mockOnUpload} />)

    await userEvent.click(screen.getByRole('button', { name: /enviar exame/i }))

    expect(screen.getByLabelText(/tipo do exame/i)).toBeInTheDocument()
  })

  it('should render a delete button for each exam when onDelete is provided', () => {
    const onDelete = jest.fn()
    renderWithRouter(<ExamFileList examFiles={mockExamFiles} onUpload={mockOnUpload} onDelete={onDelete} />)

    expect(screen.getByRole('button', { name: /remover hemograma completo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remover raio-x tórax/i })).toBeInTheDocument()
  })

  it('should call onDelete with the exam id when delete button is clicked', async () => {
    const onDelete = jest.fn()
    renderWithRouter(<ExamFileList examFiles={mockExamFiles} onUpload={mockOnUpload} onDelete={onDelete} />)

    await userEvent.click(screen.getByRole('button', { name: /remover hemograma completo/i }))

    expect(onDelete).toHaveBeenCalledWith('exam-1')
  })

  it('should not render delete buttons when onDelete is not provided', () => {
    renderWithRouter(<ExamFileList examFiles={mockExamFiles} onUpload={mockOnUpload} />)

    expect(screen.queryByRole('button', { name: /remover/i })).not.toBeInTheDocument()
  })
})
