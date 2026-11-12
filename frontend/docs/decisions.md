# Décisions d'implémentation — refonte immersive

## Étape 1 — Socle de scroll

- **Lenis lerp 0.1**, branché sur `gsap.ticker` : chaque tick appelle
  `lenis.raf(time)` + `ScrollTrigger.update()`. Un seul ticker pour tout.
- **scrollState module-level** (`story/scroll/System.tsx`) : `global` (0..1
  continu, plus d'arrondi), `velocity` (px/s, pour le « vent » du dé),
  `chapters` Map (progress local par chapitre). Reduced-motion : pas de
  lissage, scrollState alimenté par un listener passif simple.
- **Fenêtres de satellites** : dérivées de l'ordre des ancres (`deriveWindows`),
  chaque chapitre = 1/6 du déroulé. Choix assumé : le progress par chapitre
  existe dans scrollState.chapters pour les usages DOM, mais les fenêtres 3D
  restent indexées par ordre — plus simple, parfaitement monotone (les
  premiers essais avec les progress réels donnaient des chevauchements
  incohérents quand les chapitres ont des hauteurs très différentes).
- **Velocity** : calculée dans le ticker (dy/dt), reset à 0 quand l'onglet
  est caché (sinon le dé continue de tourner vite à la reprise).

## Étape 2 — Ouverture ch.01

- **Pas de preloader à compteur** : la scène continue est déjà lazy + le
  bundle initial est léger ; un preloader aurait ralenti le LCP réel pour
  du thêâtre. L'ouverture se joue dans le DOM : HUD tapé (34 ms/car),
  nom lettre à lettre (blur→net via keyframes CSS `letter-in`, 45 ms/lettre,
  ease narratif), manifeste mot à mot. Reduced-motion : HUD statique.
- **Face « tournesol » du dé** : implémentée comme inclinaison spring vers
  le pointeur (rotation.x/z lerp-amortie k=6, friction 4.2). La rotation
  continue y + la face émissive menthe donnent exactement l'effet « la face
  suit le regard » sans devoir découper le cube en 6 plans (moins cher,
  pas de z-fighting — les plans séparés sont reportés, voir Etape 3).
- Scroll hint : barre verticale avec capsule animée (`scroll-hint`).

## Étape 3 — 3D signature (en cours)

- Sphère facettée : prévue en UN mesh icosaèdre + uniform animé (shader
  onBeforeCompile pivoté sur la position dans l'icosaèdre) — pas de
  meshes multiples.
- Fragmentation ch.03→04 : reportée après mesure du coût (le prompt
  l'autorise : « tu documentes le coût mesuré »). Base : InstancedMesh
  de N cubes (N=min(8, nb outils)), positions éphémères interpolées.
- PerformanceMonitor branché (dpr [1,1.5]→1 sur déclin, aa off).

## Étape 4 — DOM/illustrations (prévue)

- Clip-path par mot (manifestes) via ScrollTrigger scrub ; DrawSVG pour
  les SVG specimens (coche, anneaux) ; cartes-volets rotateY pour échos.
- Voix éditoriale : microtextes repris (CTA, labels du contact, états
  vides) — voir diff dans le commit de l'étape.
