'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const TidioScript = () => {
  const pathname = usePathname();

  // Disable Tidio on all /admin pages
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return null;


export default function TidioScript() {
  return (
    <Script src="//code.tidio.co/ciwnugokeyrqyjbuytxq3obuxpsck58k.js" async/>
  );
}
