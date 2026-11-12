import { useEffect, useState } from 'react';

/**
 * Test proactif WebGL : tentative réelle de création de contexte
 * (webgl2 puis webgl). Si aucun contexte possible (GPU perdu, liste
 * blanche, machine virtuelle), la 3D est désactivée à la source — pas
 * de Canvas qui crash, le fallback 2D prend le relais avec bandeau.
 */
export function useWebGLAvailable(): boolean {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });
      const available = !!gl && gl.getError() === 0;
      // Un contexte créé mais en état CONTEXT_LOST_WEBGL (37442) = indisponible.
      const lost = !!gl && gl.getError() === 37442;
      setOk(available && !lost);
    } catch {
      setOk(false);
    }
  }, []);

  return ok !== false; // null = pas encore testé → on laisse monter (test rattrapé par la boundary)
}
