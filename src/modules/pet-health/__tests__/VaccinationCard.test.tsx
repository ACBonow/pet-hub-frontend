/**
 * @module pet-health
 * @file VaccinationCard.test.tsx
 * @description Tests for the VaccinationCard component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import VaccinationCard from '@/modules/pet-health/components/VaccinationCard'

// Fixed date for deterministic tests: 2026-03-19
const TODAY = new Date('2026-03-19')
const WITHIN_30_DAYS = '2026-04-10' // 22 days from today
const AFTER_30_DAYS = '2026-05-20' // 62 days from today
const PAST_DATE = '2026-01-15'

const mockVaccinations = [
  {
    id: 'vac-1',
    petId: 'pet-1',
    templateId: null,
    doseNumber: null,
    vaccineName: 'Antirrábica',
    manufacturer: null,
    batchNumber: null,
    applicationDate: '2025-03-19',
    nextDueDate: WITHIN_30_DAYS,
    veterinarianName: null,
    clinicName: null,
    fileUrl: null,
    notes: null,
    createdAt: '2025-03-19T00:00:00.000Z',
  },
  {
    id: 'vac-2',
    petId: 'pet-1',
    templateId: null,
    doseNumber: null,
    vaccineName: 'V10',
    manufacturer: null,
    batchNumber: null,
    applicationDate: '2025-06-01',
    nextDueDate: AFTER_30_DAYS,
    veterinarianName: null,
    clinicName: null,
    fileUrl: null,
    notes: null,
    createdAt: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'vac-3',
    petId: 'pet-1',
    templateId: null,
    doseNumber: null,
    vaccineName: 'Giárdia',
    manufacturer: null,
    batchNumber: null,
    applicationDate: PAST_DATE,
    nextDueDate: null,
    veterinarianName: null,
    clinicName: null,
    fileUrl: null,
    notes: 'Dose única',
    createdAt: PAST_DATE + 'T00:00:00.000Z',
  },
]

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('VaccinationCard', () => {
  it('should list vaccinations in reverse chronological order', () => {
    renderWithRouter(<VaccinationCard vaccinations={mockVaccinations} today={TODAY} />)

    // Dates: Giárdia=2026-01-15, V10=2025-06-01, Antirrábica=2025-03-19
    // Reverse chronological: Giárdia first, then V10, then Antirrábica
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Giárdia')  // vaccineName
    expect(items[1]).toHaveTextContent('V10')
    expect(items[2]).toHaveTextContent('Antirrábica')
  })

  it('should highlight vaccinations with next dose within 30 days', () => {
    renderWithRouter(<VaccinationCard vaccinations={mockVaccinations} today={TODAY} />)
    expect(screen.getByText(/próxima dose em breve/i)).toBeInTheDocument()
  })

  it('should not highlight vaccinations with next dose after 30 days', () => {
    const singleVaccination = [mockVaccinations[1]] // AFTER_30_DAYS
    renderWithRouter(<VaccinationCard vaccinations={singleVaccination} today={TODAY} />)
    expect(screen.queryByText(/próxima dose em breve/i)).not.toBeInTheDocument()
  })

  it('should display empty message when no vaccinations', () => {
    renderWithRouter(<VaccinationCard vaccinations={[]} today={TODAY} />)
    expect(screen.getByText(/nenhuma vacina registrada/i)).toBeInTheDocument()
  })

  it('should not render delete buttons when onDelete is not provided', () => {
    renderWithRouter(<VaccinationCard vaccinations={mockVaccinations} today={TODAY} />)
    expect(screen.queryByRole('button', { name: /remover/i })).not.toBeInTheDocument()
  })

  it('should render a delete button for each vaccination when onDelete is provided', () => {
    const onDelete = jest.fn()
    renderWithRouter(<VaccinationCard vaccinations={mockVaccinations} today={TODAY} onDelete={onDelete} />)
    expect(screen.getAllByRole('button', { name: /remover/i })).toHaveLength(3)
  })

  it('should call onDelete with the vaccination id when delete button is clicked', async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined)
    renderWithRouter(
      <VaccinationCard vaccinations={[mockVaccinations[0]]} today={TODAY} onDelete={onDelete} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /remover antirrábica/i })) // vaccineName
    expect(onDelete).toHaveBeenCalledWith('vac-1')
  })
})
