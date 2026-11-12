import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters } from '../../mock/data';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * LIANT : le même anneau HUD est traversé par le cadre aux frontières de
 * chapitres — un seul anneau, réutilisé (montée bas→haut, fade), piloté
 * par des ScrollTriggers posés entre les ancres (start du chapitre i+1).
 */
export function ChapterBorders() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const triggers: ScrollTrigger[] = [];
    // Petite frame : un fixed SVG animé en pure opacité/position transform.
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:30;overflow:hidden';
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ring.setAttribute('viewBox', '0 0 100 100');
    ring.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    ring.style.cssText = 'position:absolute;left:50%;top:0;width:340px;height:340px;transform:translate(-50%,-170px);opacity:0;will-change:transform,opacity';
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '48');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'var(--color-accent)');
    circle.setAttribute('stroke-width', '0.35');
    circle.setAttribute('opacity', '0.5');
    ring.append(circle);
    host.append(ring);
    document.body.append(host);

    // Frontières : top du chapitre i (i>0).
    const tops = chapters.filter((c) => c.id !== 'hero').map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    tops.forEach((el) => {
      const t = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.4 },
      });
      t.fromTo(
        ring,
        { y: window.innerHeight + 180, opacity: 0 },
        { y: -200, opacity: 1, ease: 'none', duration: 0.75 },
      ).to(ring, { opacity: 0, duration: 0.25 }, 0.78);
      triggers.push(t.scrollTrigger!);
    });

    return () => {
      triggers.forEach((t) => t.kill());
      host.remove();
    };
  }, [reduced]);

  return null;
}
