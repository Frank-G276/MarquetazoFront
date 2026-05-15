import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-4xl">⚠️</p>
          <h2 className="mt-4 text-xl font-bold text-ink">Algo salió mal</h2>
          <p className="mt-2 text-sm text-ink/60">
            Ocurrió un error inesperado. Por favor recarga la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-brand px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark"
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
