# Bible de projet : Portfolio Ludel S. G. TOPANOU — édition narrative

> Source de vérité du projet. Chaque prompt, requête de recherche et animation doit s'y conformer.

## 1. Cadre

- **Support(s)** : site portfolio (Web, React + Vite + Three.js)
- **Public** : recruteurs, clients freelance, PME béninoises cherchant un dev full-stack/data
- **Usage** : commercial (présence professionnelle) → licences permissives uniquement (CC0 / libre d'usage ou code)
- **Ton** : calme, précis, chaleureux
- **Durée / format** : long scroll narratif, ~6 chapitres, un objet 3D par chapitre

## 2. Histoire

- **Pitch (1 phrase)** : un développeur du Bénin construit des outils simples et réaux pour des problèmes concrets — ligne de code après ligne de code.
- **Enjeu** : montrer la fiabilité (livraison, sobriété, maîtrise) plutôt que l'effet.
- **Arc** :
  1. **Le point de départ** (hero) — la curiosité, l'outil qui tourne.
  2. **Le chemin** (à propos) — parcours, motivations.
  3. **La pratique** (expériences) — ce qui a été construit, avec qui, pour qui.
  4. **Les instruments** (technologies) — la boîte à outils maîtrisée.
  5. **Les preuves** (projets) — réalisations concrètes, résultats.
  6. **La continuité** (formation + contact) — apprendre encore, travailler ensemble.
- **Détail récurrent** : le **dé à neuf faces lumineux** (dié neuf faces, accent menthe) — il revient dans chaque chapitre avec un sens différent (découverte → outil → méthode → preuve → résultat → invitation). Aussi présent en 3D au hero.

## 3. Personnages

*(Pas de personnage figuratif — le « personnage » est l'objet récurrent.)*

### Le dé lumineux (objet récurrent)
- **Rôle** : fil narratif + signature visuelle
- **Description fixe** : android de 9 faces, arrêtes adoucies, surface céramique mate (#dff7e9 sur base #0c150f), une face émissive « néon menthe » #57ff9a, rotation lente continue (0.1 rad/s) + surge au scroll
- **Palette de l'objet** : céramique claire + néon menthe + ombre douce
- **Seed/référence** : scène Three.js du projet (`MintDie`), rendu studio doux

## 4. Direction visuelle

- **Style principal (bloc fixe)** : douce 3D illustration en rendu clay/toon, ombres souples, « studio lighting, soft shadows, muted background, single accent mint glow »
- **Palette** : fond `#070c09` (noir-teinté-green), surface `#122017`, accent `#57ff9a` (néon menthe), accent secondaire `#4fc3f7` (cyan, héritage), texte `#eaf5ee`, texte-discret `#93a89b`
- **Typographies** : titres — Itim (existante, conservée, esprit iconique/Cyera) ; corps — Inter ; mono — JetBrains Mono (existantes, toutes 3 ans d'age)
- **Lumière et cadrage dominants** : grands espaces négatifs, texte massif centré ou aligné à gauche, objets 3D ancrés à droite en hero et flottants discrètement le long du récit
- **Références** : Cyera (hero illustratif souple + palette unie), Luke Baffait (manifeste révélé mot-to-mot au scroll, chapitres numérotés latéraux), Midnight Video (HUD mono, sobriété)
- **Interdits** : bruns/béiges, dégradés arc-en-ciel, effekts « glass » excessifs sur le texte, scrolljack (le défilement natif reste fluide), photos de visages reconnaissables

## 5. Images illustratives sans fond (règle d'opération)

- Cherchées sur **Openverse** (CC0 / CC BY uniquement) via `search_stock_images.py` — jamais par moteur généraliste
- Sous-dossier `portfolio-assets/stock/` avec `manifest.json` (provenance, auteur, licence)
- Harmonisées (recadrage + unifier la teinte) puis exposées via `frontend/src/mock/images/`
- **Fallback généré par code** : si aucune illustration cohérente trouvée (cas de la 1re recherche du 2026-11-12), on produit des **SVG animés faits main** (objets géométriques doux, palette de la bible) — license 100 % à nous, style sous contrôle. Deux ou trois candidats présentés au propriétaire avant intégration finale.

## 6. 3D

- One scène continue r3f (fond transparent sur le contenu), de petites pièces générées par code :
  - dé 9 faces (objet récurrent) — materiau `MeshToonMaterial`+ gradient, emissive sur une face
  - sphère « céramique » mate, anneaux fins type Midnight HUD
  - un torus discret au chapitre « projets »
- Le scroll pilote des rotations/parallaxe fait maison `requestAnimationFrame` (pas de lib 3D supplémentaire)
- Charge lazy (chunk séparé), fallback 2D si WebGL indisponible ou score bas

## 7. Direction sonore

— (hors périmètre pour cette passe ; peut ajouter un brouillon audio plus tard)

## 8. Contraintes techniques

- **Formats d'export** : pages Vite (SPA), images WebP/PNG (harmonisées), SVG inline en fallback
- **Résolutions** : visuels max 1600 px de large, images lazy
- **Accessibilité** : respect absolu de `prefers-reduced-motion` ; alt sur toutes les images porteuses de sens ; contrastes AA ; le scroll est natif (jamais capturé)
- **Outils disponibles** : Node/Vite, Three.js déjà installé, Pillow (Python), Openverse (sans clé)

## 9. Validation

- **Qui valide** : Ludel (le propriétaire du site)
- **Étapes de validation** : bible (ce fichier) → récit + storyboard → visuels candidats → intégration → recette navigateur
