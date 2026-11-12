import { lazy, Suspense } from 'react';

// Ch.05 — Les preuves : chunk séparé (données projets + images).
const ChapterProof = lazy(() =>
  import('./ChapterProof').then((m) => ({ default: m.ChapterProof })),
);

export function ChapterProofLazy() {
  return (
    <Suspense fallback={<section id="projects" style={{ minHeight: 720 }} aria-busy="true" />}>
      <ChapterProof />
    </Suspense>
  );
}
