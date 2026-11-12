import { lazy, Suspense } from 'react';
import { useProfile, useSocialLinks } from './api/hooks';
import { useDeviceTier } from './hooks/useDeviceTier';
import { useReducedMotion } from './hooks/useReducedMotion';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { HeroFallback2D } from './components/hero/HeroFallback2D';
import { ChapterRail } from './story/ChapterRail';
import { ScrollSocle, ScrollTrigger } from './story/scroll/System';
import { useChapterTriggers } from './story/scroll/useChapterTriggers';
import { ChapterOpening } from './story/chapters/ChapterOpening';
import { ChapterAbout } from './story/chapters/ChapterAbout';
import { ChapterPractice } from './story/chapters/ChapterPractice';
import { ChapterFormation } from './story/chapters/ChapterFormation';
import { ChapterToolsLazy } from './story/chapters/ChapterToolsLazy';
import { ChapterProofLazy } from './story/chapters/ChapterProofLazy';
import { ChapterEchoes } from './story/chapters/ChapterEchoes';
import { ChapterContinuity } from './story/chapters/ChapterContinuity';
import { Manifest } from './story/Manifest';
import { Footer } from './components/layout/Footer';
import { useDynamicFavicon } from './hooks/useDynamicFavicon';
import { useStructuredData } from './hooks/useStructuredData';

// La scène continue : Three.js en chunk séparé, monté une fois. Elle lit
// le scroll lissé (scrollState) elle-même — plus de prop progress.
const StoryScene = lazy(() =>
  import('./story/scenes/StoryScene').then((m) => ({ default: m.StoryScene })),
);

/** Les ScrollTrigger du récit vivent sous le composant racine scène-active. */
function Récit({ sceneOn }: { sceneOn: boolean }) {
  useChapterTriggers();
  return (
    <>
      {sceneOn && (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <ErrorBoundary fallback={<HeroFallback2D />}>
            <Suspense fallback={<HeroFallback2D />}>
              <StoryScene active className="h-full w-full" />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
      <ChapterRail />
      {/* Ch.01 — Le dé */}
      <ChapterOpening />
      {/* Ch.02 — Le chemin */}
      <Manifest index="02" text="J'apprends à construire, puis à construire mieux." />
      <ChapterAbout />
      {/* Ch.03 — La pratique */}
      <Manifest index="03" text={"Le code qui compte est celui qu'on livre."} />
      <ChapterPractice />
      <ChapterFormation />
      <ChapterToolsLazy />
      <Manifest index="05" text="Des interfaces que des gens réels utilisent chaque jour." />
      <ChapterProofLazy />
      <ChapterEchoes />
      <Manifest index="06" text={"La meilleure histoire est celle qu'on écrit ensemble."} />
      <ChapterContinuity />
      <Footer />
      {/* Garde ScrollTrigger référencé pour le tree-shaking du socle */}
      <span hidden>{sceneOn ? undefined : String(ScrollTrigger.version)}</span>
    </>
  );
}

/**
 * Le site est une UE seule expérience : Lenis lisse le scroll, GSAP/ScrollTrigger
 * ancre les chapitres, la scène 3D continue lit le tout, les chapitres passent.
 */
function App() {
  const { data: profile } = useProfile();
  const { data: socialLinks } = useSocialLinks();
  useDynamicFavicon(profile?.logo);
  useStructuredData(profile, socialLinks);

  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const sceneOn = tier === 'full' && !reduced;

  return (
    <ScrollSocle>
      <Récit sceneOn={sceneOn} />
    </ScrollSocle>
  );
}

export default App;
