/**
 * @module pet-health
 * @file VaccinationCard.test.tsx
 * @description Tests for the VaccinationCard component.
 */

import { render, screen } from '@testing-library/react'
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
    name: 'Antirrábica',
    applicationDate: '2025-03-19',
    nextDoseDate: WITHIN_30_DAYS,
    notes: null,
  },
  {
    id: 'vac-2',
    name: 'V10',
    applicationDate: '2025-06-01',
    nextDoseDate: AFTER_30_DAYS,
    notes: null,
  },
  {
    id: 'vac-3',
    name: 'Giárdia',
    applicationDate: PAST_DATE,
    nextDoseDate: null,
    notes: 'Dose única',
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
    expect(items[0]).toHaveTextContent('Giárdia')
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
})
