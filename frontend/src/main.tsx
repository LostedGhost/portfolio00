import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Le récit commence toujours au début : on empêche le navigateur de restaurer
// l'ancienne position AVANT que Lenis et ScrollTrigger ne s'initialisent.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

const root = createRoot(document.getElementById('root')!)

// L'application est importée dynamiquement : si public/data/portfolio.js est absent
// ou invalide, on affiche un message clair au lieu d'une page blanche.
import('./App.tsx')
  .then(({ default: App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch((err: unknown) => {
    console.error(err)
    const message = err instanceof Error ? err.message : String(err)
    root.render(
      <main role="alert" className="mx-auto grid min-h-svh max-w-xl place-content-center gap-3 p-6">
        <h1 className="text-3xl font-bold">Contenu indisponible</h1>
        <p>Les informations du portfolio n’ont pas pu être chargées.</p>
        <pre className="whitespace-pre-wrap rounded-xl bg-white/50 p-4 text-sm">{message}</pre>
      </main>,
    )
  })
