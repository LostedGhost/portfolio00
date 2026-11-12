import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Garde-fou du rendu. En cas d'erreur, affiche le message réel (au lieu
 * d'un « une erreur est survenue » muet) pour faciliter le diagnostic,
 * ainsi qu'un bouton de rechargement propre.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center px-6 text-center">
            <div className="max-w-md space-y-4">
              <p className="text-(--color-text-dim)">Une erreur est survenue au rendu.</p>
              <p className="font-mono text-xs text-(--color-accent) break-words">{this.state.message}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="font-mono text-xs border border-(--color-border) px-4 py-2 hover:border-(--color-accent) transition-colors"
              >
                Recharger
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
