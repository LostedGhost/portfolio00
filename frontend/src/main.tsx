import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/shared/ErrorBoundary.tsx'
import './index.css'

const queryClient = new QueryClient()

// Préchargement en idle des chunks paresseux (scène 3D outils, projets) :
// prêts avant que l'utilisateur n'atteigne ces chapitres, sans retarder
// le premier rendu.
window.requestIdleCallback?.(() => {
  void import('./story/chapters/ChapterTools');
  void import('./story/chapters/ChapterProof');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Pas de fallback en prop : l'ErrorBoundary affiche le VRAI message
        d'erreur + un bouton Recharger (diagnostic intégré). */}
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
