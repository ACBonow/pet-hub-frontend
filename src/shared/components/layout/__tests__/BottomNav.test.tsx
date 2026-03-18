/**
 * @module shared
 * @file BottomNav.test.tsx
 * @description Tests for the mobile BottomNav layout component.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '@/shared/components/layout/BottomNav'

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('BottomNav', () => {
  it('should render all navigation links', () => {
    renderWithRouter(<BottomNav />)

    expect(screen.getByRole('link', { name: /início/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pets/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /adoção/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /achados/i })).toBeInTheDocument()
  })

  it('should link to the correct routes', () => {
    renderWithRouter(<BottomNav />)

    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /pets/i })).toHaveAttribute('href', '/pets')
    expect(screen.getByRole('link', { name: /adoção/i })).toHaveAttribute('href', '/adocao')
    expect(screen.getByRole('link', { name: /achados/i })).toHaveAttribute('href', '/achados-perdidos')
  })

  it('should have lg:hidden class for mobile-only display', () => {
    const { container } = renderWithRouter(<BottomNav />)
    expect(container.firstChild).toHaveClass('lg:hidden')
  })

  it('should have a nav role', () => {
    renderWithRouter(<BottomNav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
