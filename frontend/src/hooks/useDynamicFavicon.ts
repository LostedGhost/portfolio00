import { useEffect } from 'react';

/**
 * Points the favicon/apple-touch-icon at the profile logo once it loads.
 * The static files in public/ (favicon.ico, etc.) are the fallback shown
 * before the API responds — this is what makes changing the logo in the
 * admin actually change the browser tab icon without a new deploy.
 */
export function useDynamicFavicon(logoUrl: string | null | undefined) {
  useEffect(() => {
    if (!logoUrl) return;

    const selectors = ['link[rel="icon"]', 'link[rel="apple-touch-icon"]'];
    const updated: { el: HTMLLinkElement; prevHref: string }[] = [];

    for (const selector of selectors) {
      document.querySelectorAll<HTMLLinkElement>(selector).forEach((el) => {
        updated.push({ el, prevHref: el.href });
        el.href = logoUrl;
      });
    }

    return () => {
      updated.forEach(({ el, prevHref }) => {
        el.href = prevHref;
      });
    };
  }, [logoUrl]);
}
