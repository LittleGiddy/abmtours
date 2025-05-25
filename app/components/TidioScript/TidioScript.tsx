'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function TidioScript() {
  const pathname = usePathname();

  // Prevent Tidio from loading on /admin or any sub-routes like /admin/dashboard
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <Script
      src="//code.tidio.co/ciwnugokeyrqyjbuytxq3obuxpsck58k.js"
      strategy="afterInteractive"
    />
  );
}
