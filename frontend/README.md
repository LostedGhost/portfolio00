# Portfolio — Ludel Topanou

Site **100 % statique** (aucun backend) : React 19 + Vite + Tailwind 4 + GSAP/ScrollTrigger + Lenis.
`npm run build` produit `dist/`, servi tel quel par Vercel.

## Mettre le contenu à jour

Tout le contenu est dans **`src/config/portfolio.ts`** : identité, textes, compétences, projets, méthode, contact.

- **Photo / logo** : déposez le fichier dans `public/images/`, puis renseignez `site.photo` / `site.logo`
  (ex. `'/images/photo.webp'`). Vide = illustration / initiales.
- **Captures d'un projet** : `images: ['/images/suivicm-1.webp', …]` sur le projet → un carrousel apparaît.
- **Lien d'un projet** : `link.href` (externe) ou `link.ask` (ouvre le formulaire prérempli).

## Architecture (reprise du site-commune)

```
src/
├── config/portfolio.ts   # ★ seul fichier de contenu
├── lib/
│   ├── motion.ts         # GSAP + ScrollTrigger + Lenis, mouvement réduit, scrollToId
│   └── utils.ts          # cn()
├── components/           # briques réutilisables (icon, brand, roll-link, split-letters,
│                         #   scroll-text-reveal, progress-rail, project-visual)
├── sections/             # un fichier par chapitre, dans l'ordre de App.tsx
│   ├── preloader.tsx     # compteur 000→100, rideau
│   ├── nav.tsx           # pilule de verre, apparaît après le hero
│   ├── hero.tsx          # nom géant qui explose au défilement (épinglé)
│   ├── about.tsx         # intro révélée au scroll, faits, portrait, compétences
│   ├── tools-marquee.tsx # bandeau d'outils
│   ├── projects.tsx      # cartes empilées qui se tassent
│   ├── method.tsx        # méthode spec-first, ligne lumineuse
│   └── contact-footer.tsx# formulaire mailto + signature géante
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
