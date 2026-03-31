/**
 * @module shared
 * @file __tests__/CreatorBadge.test.tsx
 * @description Tests for CreatorBadge — renders person/org icon, name, avatar or initial.
 */

import { render, screen } from '@testing-library/react'
import CreatorBadge from '@/shared/components/ui/CreatorBadge'

describe('CreatorBadge', () => {
  it('should display name and person icon for type=person', () => {
    render(<CreatorBadge type="person" name="Ana Silva" />)
    expect(screen.getByText('Ana Silva')).toBeInTheDocument()
    expect(screen.getByLabelText('Pessoa')).toBeInTheDocument()
  })

  it('should display name and org icon for type=org', () => {
    render(<CreatorBadge type="org" name="Pet Rescue ONG" />)
    expect(screen.getByText('Pet Rescue ONG')).toBeInTheDocument()
    expect(screen.getByLabelText('Organização')).toBeInTheDocument()
  })

  it('should display initial when photoUrl is not provided', () => {
    render(<CreatorBadge type="person" name="Carlos Matos" />)
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should display avatar image when photoUrl is provided', () => {
    render(<CreatorBadge type="org" name="Pet Rescue ONG" photoUrl="https://cdn.example.com/org.jpg" />)
    const img = screen.getByRole('img', { name: 'Pet Rescue ONG' })
    expect(img).toHaveAttribute('src', 'https://cdn.example.com/org.jpg')
  })
})
