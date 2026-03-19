/**
 * @module pet-health
 * @file ExamFileList.test.tsx
 * @description Tests for the ExamFileList component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ExamFileList from '@/modules/pet-health/components/ExamFileList'

const mockExamFiles = [
  {
    id: 'exam-1',
    name: 'Hemograma Completo',
    fileUrl: 'https://storage.example.com/exams/hemograma.pdf',
    examDate: '2026-01-10',
    fileType: 'PDF',
  },
  {
    id: 'exam-2',
    name: 'Raio-X Tórax',
    fileUrl: 'https://storage.example.com/exams/raio-x.png',
    examDate: '2026-02-20',
    fileType: 'IMAGE',
  },
]

const mockOnUpload = jest.fn()

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('ExamFileList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list exam files with name and date', () => {
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

  it('should show file input when upload button is clicked', async () => {
    renderWithRouter(<ExamFileList examFiles={[]} onUpload={mockOnUpload} />)

    await userEvent.click(screen.getByRole('button', { name: /enviar exame/i }))

    expect(screen.getByLabelText(/arquivo/i)).toBeInTheDocument()
  })
})
