import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Coarse heuristic deciding whether the full 3D experience should render.
 * Combines OS-level reduced-motion, viewport width, and core count — good
 * enough to keep low-end/mobile devices off the heavier r3f scenes without
 * pulling in a full GPU-benchmarking library for a portfolio site.
 */
export function useDeviceTier(): 'full' | 'lite' {
  const reducedMotion = useReducedMotion();
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const lowCores = typeof navigator !== 'undefined' && !!navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  if (reducedMotion || (narrow && lowCores)) return 'lite';
  return 'full';
}
