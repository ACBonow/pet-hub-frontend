/**
 * @module shared
 * @file Pagination.test.tsx
 * @description Tests for the shared Pagination component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '@/shared/components/ui/Pagination'

describe('Pagination', () => {
  it('should display "Página X de Y"', () => {
    render(<Pagination page={2} totalPages={5} onPrev={jest.fn()} onNext={jest.fn()} />)
    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('should disable Anterior button on first page', () => {
    render(<Pagination page={1} totalPages={5} onPrev={jest.fn()} onNext={jest.fn()} />)
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
  })

  it('should disable Próxima button on last page', () => {
    render(<Pagination page={5} totalPages={5} onPrev={jest.fn()} onNext={jest.fn()} />)
    expect(screen.getByRole('button', { name: /próxima/i })).toBeDisabled()
  })

  it('should enable both buttons on a middle page', () => {
    render(<Pagination page={3} totalPages={5} onPrev={jest.fn()} onNext={jest.fn()} />)
    expect(screen.getByRole('button', { name: /anterior/i })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /próxima/i })).not.toBeDisabled()
  })

  it('should call onPrev when Anterior is clicked', async () => {
    const onPrev = jest.fn()
    render(<Pagination page={3} totalPages={5} onPrev={onPrev} onNext={jest.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /anterior/i }))
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('should call onNext when Próxima is clicked', async () => {
    const onNext = jest.fn()
    render(<Pagination page={3} totalPages={5} onPrev={jest.fn()} onNext={onNext} />)
    await userEvent.click(screen.getByRole('button', { name: /próxima/i }))
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
