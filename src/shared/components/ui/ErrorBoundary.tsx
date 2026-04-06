/**
 * @module shared
 * @file ErrorBoundary.tsx
 * @description Class-based Error Boundary that catches runtime errors anywhere
 * in the component tree and renders a friendly fallback in Portuguese.
 * React does not support hook-based error boundaries.
 */

import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Algo deu errado</h1>
          <p className="text-gray-600 max-w-sm">
            Ocorreu um erro inesperado. Tente recarregar a página ou volte mais tarde.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-[--color-primary] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Tentar novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
