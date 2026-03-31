/**
 * @module adoption
 * @file __tests__/AdoptionCard.test.tsx
 * @description Tests for AdoptionCard — rendering with and without createdBy.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdoptionCard from '@/modules/adoption/components/AdoptionCard'
import type { AdoptionListing } from '@/modules/adoption/types'

const BASE_LISTING: AdoptionListing = {
  id: 'adoption-1',
  petId: 'pet-1',
  petName: 'Rex',
  species: 'dog',
  breed: null,
  photoUrl: null,
  gender: null,
  castrated: null,
  description: null,
  status: 'AVAILABLE',
  contactEmail: null,
  contactPhone: null,
  contactWhatsapp: null,
  organizationId: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function renderCard(listing: AdoptionListing) {
  return render(
    <MemoryRouter>
      <ul>
        <AdoptionCard listing={listing} />
      </ul>
    </MemoryRouter>,
  )
}

describe('AdoptionCard', () => {
  it('should display CreatorBadge when createdBy is provided', () => {
    renderCard({
      ...BASE_LISTING,
      createdBy: { type: 'org', name: 'Pet Rescue ONG' },
    })
    expect(screen.getByText('Pet Rescue ONG')).toBeInTheDocument()
    expect(screen.getByLabelText('Organização')).toBeInTheDocument()
  })

  it('should not break when createdBy is absent', () => {
    renderCard(BASE_LISTING)
    expect(screen.getByText('Rex')).toBeInTheDocument()
    expect(screen.queryByLabelText('Organização')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Pessoa')).not.toBeInTheDocument()
  })
})
