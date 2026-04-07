/**
 * @module pages
 * @file NotFoundPage.test.tsx
 * @description Tests for the 404 Not Found page.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('NotFoundPage', () => {
  it('should render 404 message in Portuguese', () => {
    renderWithRouter(<NotFoundPage />)
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument()
  })

  it('should display a link to go back home', () => {
    renderWithRouter(<NotFoundPage />)
    const link = screen.getByRole('link', { name: /voltar para o início/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('should show 404 code', () => {
    renderWithRouter(<NotFoundPage />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
