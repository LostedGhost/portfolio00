import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)
// ScrollTrigger mémorise la position de défilement au rechargement : le récit doit repartir du début.
ScrollTrigger.clearScrollMemory('manual')

export { gsap, ScrollTrigger, useGSAP }

const QUERY = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches

/** Vrai si l'utilisateur a demandé moins d'animations (mis à jour en direct). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Instance active (une seule par page). */
let active: Lenis | null = null

/** Défilement fluide Lenis synchronisé avec ScrollTrigger (désactivé si mouvement réduit). */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    active = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      active = null
    }
  }, [enabled])
}

/** Défile jusqu'à une ancre (Lenis si actif, sinon défilement natif). */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (active) active.scrollTo(el, { duration: 1.4 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Intercepte les liens internes `href="#id"` pour passer par scrollToId. */
export function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href')
  if (!href?.startsWith('#') || href.length < 2) return
  e.preventDefault()
  scrollToId(href.slice(1))
  history.replaceState(null, '', href)
}
