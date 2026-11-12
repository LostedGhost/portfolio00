import { lazy, Suspense, Component } from 'react';
import { useProfile, useSocialLinks } from './api/hooks';
import { useDeviceTier } from './hooks/useDeviceTier';
import { useReducedMotion } from './hooks/useReducedMotion';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { HeroFallback2D } from './components/hero/HeroFallback2D';
import { ChapterRail } from './story/ChapterRail';
import { ScrollSocle } from './story/scroll/System';
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
import { CustomCursor } from './story/overlay/Cursor';
import { ChapterBorders } from './story/overlay/ChapterBorders';
import { TechMarquee } from './story/overlay/Atoms';
import { PreloaderOverlay, usePreloader } from './story/overlay/Preloader';
import { Footer } from './components/layout/Footer';
import { useDynamicFavicon } from './hooks/useDynamicFavicon';
import { useStructuredData } from './hooks/useStructuredData';

// La scène continue : Three.js en chunk séparé, monté une fois. Elle lit
// le scroll lissé (scrollState) elle-même — plus de prop progress.
const StoryScene = lazy(() =>
  import('./story/scenes/StoryScene').then((m) => ({ default: m.StoryScene })),
);

/** Le récit complet, habillé des liants globaux. Chaque bloc critique est
 *  protégé par son propre boundary de diagnostic (message précis). */
function Récit({ sceneOn, opened }: { sceneOn: boolean; opened: boolean }) {
  useChapterTriggers();
  const guard = (name: string, node: React.ReactNode) => (
    <ZoneBoundary key={name} name={name}>
      {node}
    </ZoneBoundary>
  );

  return (
    <>
      {sceneOn && (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <ErrorBoundary fallback={<HeroFallback2D />}>
            <Suspense fallback={<HeroFallback2D />}>
              <StoryScene active opened={opened} className="h-full w-full" />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
      <CustomCursor />
      <ChapterBorders />
      <ChapterRail />
      {/* Ch.01 — Le dé */}
      <ChapterOpening />
      {/* Ch.02 — Le chemin */}
      {guard('manifest-02', <Manifest index="02" text="J'apprends à construire, puis à construire mieux." />)}
      {guard('about', <ChapterAbout />)}
      {/* Ch.03 — La pratique */}
      {guard('manifest-03', <Manifest index="03" text="Le code qui compte est celui qu'on livre." />)}
      {guard('practice', <ChapterPractice />)}
      {guard('formation', <ChapterFormation />)}
      {guard('tools', <ChapterToolsLazy />)}
      {/* Respiration : les outils défilent en filigrane */}
      <TechMarquee />
      {guard('manifest-05', <Manifest index="05" text="Des interfaces que des gens réels utilisent chaque jour." />)}
      {guard('proof', <ChapterProofLazy />)}
      {guard('echoes', <ChapterEchoes />)}
      {guard('manifest-06', <Manifest index="06" text="La meilleure histoire est celle qu'on écrit ensemble." />)}
      {guard('contact', <ChapterContinuity />)}
      <Footer />
    </>
  );
}

/** Boundary de zone : affiche le nom du bloc qui a planté + l'erreur. */
class ZoneBoundary extends Component<{ name: string; children: React.ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(e: unknown) {
    return { error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
  }
  componentDidCatch(e: unknown) {
    console.error('[ZoneBoundary]', e);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="section font-mono text-xs text-(--color-text-dim) border border-red-500/40 p-4">
          Zone « {this.props.name} » en erreur : <span className="text-(--color-accent)">{this.state.error}</span> — le reste du récit continue.
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Le site est une seule expérience : Lenis lisse le scroll, GSAP/ScrollTrigger
 * ancre les chapitres, la scène 3D continue lit le tout, le grain unifie.
 */
function App() {
  const { data: profile } = useProfile();
  const { data: socialLinks } = useSocialLinks();
  useDynamicFavicon(profile?.logo);
  useStructuredData(profile, socialLinks);

  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const sceneOn = tier === 'full' && !reduced;
  const { ready, pct } = usePreloader();

  return (
    <ScrollSocle>
      <div className={sceneOn ? 'grain' : undefined}>
        {/* Blocage du scroll pendant le preloader */}
        <style>{ready ? '' : 'body { overflow: hidden; }'}</style>
        <PreloaderOverlay ready={ready} pct={pct} />
        <Récit sceneOn={sceneOn} opened={ready} />
      </div>
    </ScrollSocle>
  );
}

export default App;
