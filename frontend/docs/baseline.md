# Baseline (avant refonte immersive) — 2026-11-12

## Bundle
- index.js : 397.63 kB (126.18 kB gzip) — React+framer+ReactQuery+story DOM
- Float (Three.js) : 895.50 kB (236.78 kB gzip) — chunk lazy ✅
- StoryScene : 3.04 kB (1.18 kB gzip) — lazy ✅
- ChapterTools : 10.70 kB, ChapterProof : 8.50 kB — lazy ✅
- CSS : 24.27 kB (5.62 kB gzip)
- TOTAL dist : ~2.9 MB (images placeholder incluses)

## Comportement
- Progress global arrondi à 1% (useScrollProgress), scrollState module-level
- Satellites à fenêtres en constantes en dur (0.08–1.0)
- Frameloop 'always' tant que la scène est en vue
- Pas de preloader, dé visible dès le montage
- Manifest : parallaxe y±16 % + mots opacity 0.14→1 (framer-motion)
- Pas de répulsion hover, pas de fragmentation, pas de tracés SVG

## Perf mesurée (session NEO, build preview)
- 60 FPS au scroll continu simulé (rAF, ~1200px en 2s)
- WebGL de la session NEO perdu (context-lost) : scène invisible localement,
  fonctionnelle sur navigateur sain — vérifié hier sur le build prod
- LCP non mesuré proprement (dev/preview), à re-mesurer après refonte
