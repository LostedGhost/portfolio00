# Scénario — Portfolio Ludel (édition narrative)

Version 1 paragraphe :

> Ludel TOPANOU a commencé par la curiosité d'un dé, chaque face révélant un langage
> à apprendre. Aujourd'hui développeur full-stack et data analyst à Cotonou, il
> transforme des problèmes concrets en outils simples et vivants : une école
> gérée mieux, une coopérative qui voit ses ventes, une boutique qui vend en
> ligne. Entre Django, React et PostgreSQL, sa méthode reste la même : bien
> poser la question, choisir l'outil juste, livrer propre. Ce portfolio suit le
> dé, chapitre après chapitre, jusqu'à l'invitation : la suite, c'est vous.

## Chapitres (numérotés, à la Luke Baffait)

| # | Titre (affiché) | Manifeste (révélé au scroll) | Objet 3D | Contenu data |
|---|---|---|---|---|
| 01 | Le dé | « Chaque projet commence par une question simple. » | dé lumineux (lancement) | Hero : nom, titre, statut disponible, CTA « Découvrir l'histoire » |
| 02 | Le chemin | « J'apprends à construire, puis à construire mieux. » | sphère céramique | À propos : description, stats, compétences |
| 03 | La pratique | « Le code qui compte est celui qu'on livre. » | anneaux fins | Expériences (timeline brillée) |
| 04 | Les instruments | « Peu d'outils, maîtrisés ». | dé qui tourne sur une face | Technologies (cubes persistants, palette menthe) |
| 05 | Les preuves | « Des interfaces que des gens réels utilisent chaque jour. » | torus doux | Projets (cartes + modal) |
| 06 | La continuité | « La meilleure histoire est celle qu'on écrit ensemble. » | dé qui s'ouvre | Formation + certifications + contact |

## Manifestes — textes exacts

Ch1 : « Chaque projet commence par une question simple. »
Ch2 : « J'apprends à construire, puis à construire mieux. »
Ch3 : « Le code qui compte est celui qu'on livre. »
Ch4 : « Peu d'outils, maîtrisés. »
Ch5 : « Des interfaces que des gens réels utilisent chaque jour. »
Ch6 : « La meilleure histoire est celle qu'on écrit ensemble. »

## Règles de progression

- Le chiffre de chapitre apparaît en mono cyan sur la gauche (comme Luke : `01`), progressbar de chapitre en colonne droite.
- Le manifeste est révéle **mot par mot lié au scroll** (poids léger : split + opacité/blur par mot, piloté par rAF/scroll listener throttlé).
- Une seule animation principale à l'écran à la fois (règle du skill).
- Le contenu data (skills/projets/contact) ne change pas : il est habillé, réorganisé, mais reste servi par data.ts addressable.
