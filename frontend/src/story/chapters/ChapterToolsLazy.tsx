import { lazy, Suspense } from 'react';
import { Chapter } from '../Chapter';

// Ch.04 — Les instruments : Three.js dans un chunk séparé.
const ChapterTools = lazy(() =>
  import('./ChapterTools').then((m) => ({ default: m.ChapterTools })),
);

/** Réserve l'espace du chapitre Technologies pendant le téléchargement. */
export function ChapterToolsLazy() {
  return (
    <Suspense fallback={<section id="technologies" style={{ minHeight: 640 }} aria-busy="true" />}>
      <ChapterTools />
    </Suspense>
  );
}

// Chapter est importé pour garder la même ancre Chapitre si le fallback est affiché brièvement.
void Chapter;
