# Portfolio — Ludel Topanou

Site **100 % statique** (aucun backend) : React 19 + Vite + Tailwind 4 + GSAP/ScrollTrigger + Lenis.
`npm run build` produit `dist/`, servi tel quel par Vercel.

## Mettre le contenu à jour

Toutes mes informations sont dans **`public/data/portfolio.js`** : identité, liens, photo, logo,
textes, compétences, projets (avec leurs images), méthode, contact.
C'est un fichier JS brut (`window.PORTFOLIO = { … }`) chargé par `index.html` avant l'application,
sans compilation. Les commentaires en tête du fichier listent les icônes, illustrations et couleurs possibles.

- **Images** : déposez-les dans `public/images/` et indiquez `'/images/mon-fichier.webp'` (ou une URL https).
- **Captures d'un projet** : `images: ['/images/suivicm-1.webp', …]` → un carrousel apparaît sur la carte.
- **Lien d'un projet** : `link.href` (externe) ou `link.ask` (ouvre le formulaire prérempli).
- **Mots surlignés** dans l'intro : entourez-les d'astérisques, `*développeur fullstack*`.

`src/config/portfolio.ts` vérifie et type ces données. Si le fichier est absent ou mal formé,
le site affiche un message qui indique le champ en cause au lieu d'une page blanche.

## Architecture (reprise du site-commune)

```
src/
├── config/portfolio.ts   # lecture + validation de public/data/portfolio.js
├── lib/
│   ├── motion.ts         # GSAP + ScrollTrigger + Lenis, mouvement réduit, scrollToId
│   └── utils.ts          # cn()
├── components/           # briques réutilisables (icon, brand, roll-link, split-letters,
│                         #   scroll-text-reveal, progress-rail, project-visual)
├── sections/             # un fichier par chapitre, dans l'ordre de App.tsx
│   ├── preloader.tsx     # compteur 000→100, rideau
│   ├── hero.tsx          # nom géant qui explose au défilement (épinglé)
│   ├── about.tsx         # intro révélée au scroll, faits, portrait, compétences
│   ├── tools-marquee.tsx # bandeau d'outils
│   ├── projects.tsx      # cartes empilées qui se tassent
│   ├── method.tsx        # méthode spec-first, ligne lumineuse
│   └── contact-footer.tsx# formulaire mailto + pied de page plein écran
├── App.tsx
└── index.css             # charte émeraude & verre (clair + sombre automatique)
```

## Formulaire de contact

Sans backend : il ouvre la messagerie du visiteur avec un e-mail prêt à envoyer à `site.email`.

## Commandes

```bash
npm install
npm run dev      # développement
npm run build    # vérification TypeScript + build de production
npm run lint     # oxlint
```

## Déploiement Vercel

`vercel.json` (dans `frontend/`) fixe le framework Vite, la sortie `dist/` et le cache long des assets.
Le projet Vercel doit avoir **Root Directory = `frontend`** (comme avant).
