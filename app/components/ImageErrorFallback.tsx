'use client';

import { useEffect } from 'react';

const BLOB_HOST_SUFFIX = '.blob.vercel-storage.com';

const PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><rect width="800" height="600" fill="#e2e8f0"/><g fill="none" stroke="#94a3b8" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"><rect x="264" y="222" width="272" height="176" rx="14"/><circle cx="326" cy="278" r="24"/><path d="M284 376 366 300 418 348 464 314 516 376"/></g></svg>'
)}`;

/**
 * Renders a neutral placeholder in place of any image served from a
 * Vercel Blob host that fails to load. Harmless once the store is
 * reachable again: no error fires, so nothing is swapped.
 */
export default function ImageErrorFallback() {
  useEffect(() => {
    const onError = (event: Event) => {
      const target = event.target;

      if (!(target instanceof HTMLImageElement)) return;
      if (target.dataset.blobFallback === 'done') return;

      let host = '';

      try {
        host = new URL(target.currentSrc || target.src, window.location.href).host;
      } catch {
        return;
      }

      if (!host.endsWith(BLOB_HOST_SUFFIX)) return;

      target.dataset.blobFallback = 'done';
      // next/image renders a srcset; clear it so the browser actually
      // requests the placeholder instead of retrying a broken candidate.
      target.removeAttribute('srcset');
      target.removeAttribute('sizes');
      target.src = PLACEHOLDER;
    };

    window.addEventListener('error', onError, true);

    return () => window.removeEventListener('error', onError, true);
  }, []);

  return null;
}
