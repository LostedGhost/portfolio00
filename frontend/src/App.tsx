import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger, useReducedMotion, useSmoothScroll } from '@/lib/motion'
import { Preloader } from '@/sections/preloader'
import { Nav } from '@/sections/nav'
import { Hero } from '@/sections/hero'
import { About } from '@/sections/about'
import { ToolsMarquee } from '@/sections/tools-marquee'
import { Projects } from '@/sections/projects'
import { Method } from '@/sections/method'
import { ContactFooter } from '@/sections/contact-footer'
import { ProgressRail } from '@/components/progress-rail'

export default function App() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  useSmoothScroll(!reduced)

  // Pas de défilement pendant le prologue
  useEffect(() => {
    document.documentElement.style.overflow = ready ? '' : 'hidden'
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  const done = useCallback(() => setReady(true), [])

  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:font-semibold focus:text-white">
        Aller au contenu
      </a>
      {!ready && <Preloader onDone={done} />}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(40vw_40vw_at_10%_20%,rgb(52_211_153/0.35),transparent_70%),radial-gradient(45vw_45vw_at_90%_60%,rgb(110_231_183/0.4),transparent_70%),radial-gradient(35vw_35vw_at_30%_95%,rgb(16_185_129/0.25),transparent_70%)] dark:opacity-40" />
      <Nav />
      <ProgressRail />
      <Hero ready={ready} />
      <main id="contenu">
        <About />
        <ToolsMarquee />
        <Projects />
        <Method />
      </main>
      <ContactFooter />
    </>
  )
}
