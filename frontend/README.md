# Frontend — Portfolio narratif (mode autonome)

React 19 + Vite + Tailwind 4 + React Query + Framer Motion + Three.js.

## Le site est un récit

Une seule expérience narrative en 6 chapitres (voir `../portfolio-assets/bible.md`
et `scenario.md` pour la direction artistique et les textes) :

| Chapitre | Titre | Contenu |
|---|---|---|
| 01 | Le dé | Hero : nom massif, HUD mono, manifeste auto-révélé |
| 02 | Le chemin | À propos, chiffres, compétences |
| 03 | La pratique | Timeline dessinée au scroll, formation |
| 04 | Les instruments | Dés-cubes 3D des technologies |
| 05 | Les preuves | Projets (modal au clic) + interlude « échos » |
| 06 | La continuité | Contact mailto / POST |

**Fond 3D continu** : une scène Three.js unique, fixe derrière toute la page,
vit avec le scroll (satellites céramique/anneaux/donut qui traversent le cadre,
chapitre après chapitre). Manifestes révélés mot à mot avec parallaxe.

## Architecture

```
src/
├── api/              # Couche d'accès bascule mock <-> backend (inchange)
├── mock/             # TOUT le contenu éditable : data.ts + images/
├── story/            # ★ Le récit
│   ├── Chapter.tsx         # Gabarit de chapitre
│   ├── ChapterRail.tsx     # Rail de progression latéral
│   ├── Manifest.tsx        # Phrase-manifeste parallaxe + mots révélés au scroll
│   ├── scenes/StoryScene.tsx  # Fond 3D continu (Three.js, chunk séparé)
│   ├── specimens/          # Illustrations SVG faites main (sans licence tierce)
│   └── chapters/           # Un fichier par chapitre
│       ├── ChapterOpening.tsx    # Ch.01
│       ├── ChapterAbout.tsx      # Ch.02 (+ parts/SkillBar, StatRow)
│       ├── ChapterPractice.tsx   # Ch.03
│       ├── ChapterFormation.tsx  # (suite ch.03)
│       ├── ChapterToolsLazy.tsx  # Ch.04 — chunk séparé
│       ├── ChapterProofLazy.tsx  # Ch.05 — chunk séparé (parts/Modal)
│       ├── ChapterEchoes.tsx     # Interlude témoignages
│       └── ChapterContinuity.tsx # Ch.06 (+ parts/SocialLinks)
├── components/       # Infrastructure partagée restante (Footer, ErrorBoundary, fallbacks)
└── hooks/            # useScrollProgress, useDeviceTier, useReducedMotion…
```

## Lancer

```bash
npm install
npm run dev      # http://localhost:5173 (ou port libre suivant)
npm run build && npm run preview   # build de prod, http://localhost:4173
```

## Performance

Bundle initial **~124 kB gzip**. Three.js (237 kB gzip) en chunk séparé,
préchargé en idle (jamais dans le chemin critique). Scroll natif, listener
passif + rAF : **60 FPS mesurés** pendant un défilement continu avec la
scène 3D active. `prefers-reduced-motion` respecté partout (texte net,
scène désactivée).

## Modifier le contenu

Tout le texte et les données : `src/mock/data.ts`.
Illustrations du récit : `src/story/specimens/Illustration.tsx` (SVG).
Direction artistique et palette : `src/index.css` (`@theme`) — la bible
complète est dans `../portfolio-assets/bible.md`.

## Repasser au backend plus tard

`frontend/.env.local` avec `VITE_API_BASE_URL=http://localhost:8000`,
puis relancer. Supprimer le fichier pour revenir au mode autonome.


## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichee (par defaut http://localhost:5173).

## Structure

```
src/
├── api/
│   ├── client.ts     # Couche d'acces : bascule automatique local <-> backend
│   └── hooks.ts      # Hooks React Query (inchanges)
├── mock/
│   ├── data.ts       # TOUT le contenu modifiable : profil, projets, experiences...
│   └── images/       # Images : remplacer les fichiers en gardant les memes noms
├── components/       # Composants par section (hero, about, projects...)
├── hooks/            # Hooks utilitaires
└── lib/types.ts      # Types partages (identiques au backend)
```

## Mettre a jour le contenu

| Je veux changer...              | Ou ?                                                                 |
|--------------------------------|----------------------------------------------------------------------|
| Nom, titre, description, email | `src/mock/data.ts` -> objet `profile`                                 |
| Textes/infos de contact        | `src/mock/data.ts` -> `contactInfo`                                   |
| Competences (barres %)         | `src/mock/data.ts` -> `skills`                                        |
| Projets (ajout/retrait)        | `src/mock/data.ts` -> `projects` (+ image dans `src/mock/images/`)    |
| Experiences, formation, certs  | `src/mock/data.ts` -> `experiences`, `education`, `certifications`    |
| Temoignages                    | `src/mock/data.ts` -> `testimonials`                                  |
| Reseaux sociaux                | `src/mock/data.ts` -> `socialLinks`                                   |
| Logos de technologies          | `src/mock/images/tech-*.png` (memes noms)                             |
| Photo / logo / hero            | `src/mock/images/photo.png`, `logo.png`, `hero.png`...                |
| Titre de l'onglet navigateur   | `index.html` (`<title>` + meta description)                           |

Apres modification de `data.ts` ou `index.html`, Vite recharge tout seul.
Pour remplacer une **image** : ecraser le fichier dans `src/mock/images/` avec
le meme nom, c'est tout.

## Repasser au backend plus tard

Creer un fichier `frontend/.env.local` (-ignore par git*) :

```env
VITE_API_BASE_URL=http://localhost:8000
```

Relancer `npm run dev`. Tout redevient comme avant : donnees Django, formulaire
de contact POST, lien admin. Supprimez le fichier pour revenir au mode autonome.

\* `.gitignore` contient deja `*.local`.

## Build de production

```bash
npm run build   # -> dist/
npm run preview # apercu du build
```

En mode autonome, `dist/` est un site 100% statique deployable n'importe ou
(Netlify, Vercel, GitHub Pages, serveur simple...).
