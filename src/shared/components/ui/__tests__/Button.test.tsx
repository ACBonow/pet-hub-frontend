/**
 * @module shared
 * @file Button.test.tsx
 * @description Tests for the shared Button component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/shared/components/ui/Button'

describe('Button', () => {
  it('should render with the provided text', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clique</Button>)

    await userEvent.click(screen.getByRole('button', { name: /clique/i }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Ação</Button>)
    expect(screen.getByRole('button', { name: /ação/i })).toBeDisabled()
  })

  it('should be disabled and show loading text when loading prop is true', () => {
    render(<Button loading>Salvar</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument()
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Ação</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply primary variant classes by default', () => {
    render(<Button>Primário</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-green text-white')
  })

  it('should apply secondary variant classes', () => {
    render(<Button variant="secondary">Secundário</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('border-green text-green')
  })

  it('should apply danger variant classes', () => {
    render(<Button variant="danger">Excluir</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-red')
  })

  it('should merge additional className', () => {
    render(<Button className="mt-4">Botão</Button>)
    expect(screen.getByRole('button').className).toContain('mt-4')
  })

  it('should forward type prop', () => {
    render(<Button type="submit">Enviar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
