/**
 * @module shared
 * @file ErrorBoundary.test.tsx
 * @description Tests for the ErrorBoundary class component.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '@/shared/components/ui/ErrorBoundary'

// Component that throws an error when `shouldThrow` is true
function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error')
  return <div>Conteúdo normal</div>
}

// Suppress React's console.error output for intentional throws in tests
let consoleErrorSpy: jest.SpyInstance

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
})

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Conteúdo normal')).toBeInTheDocument()
  })

  it('should render fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('heading', { name: /algo deu errado/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('should not render children when an error has been caught', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.queryByText('Conteúdo normal')).not.toBeInTheDocument()
  })

  it('should call console.error when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('should call window.location.reload when "Tentar novamente" is clicked', () => {
    const reloadMock = jest.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadMock },
    })

    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    )

    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('should display a friendly message in Portuguese', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/ocorreu um erro inesperado/i)).toBeInTheDocument()
  })
})
