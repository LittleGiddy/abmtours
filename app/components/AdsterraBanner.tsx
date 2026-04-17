// components/AdsterraBanner.tsx - CORRECT implementation
"use client";
import { useEffect, useRef } from "react";

const AdsterraBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  
  const atOptions = {
    key: 'a76e1d096eab2353ff5c7af1f6d5ff0f',
    format: 'iframe',
    height: 50,
    width: 320,
    params: {},
  };
  
  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.firstChild) {
      const configScript = document.createElement('script');
      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = `//www.highperformanceformat.com/${atOptions.key}/invoke.js`;
      configScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;
      
      bannerRef.current.append(configScript);
      bannerRef.current.append(adScript);
    }
  }, []);
  
  return <div ref={bannerRef} className="flex justify-center my-4" />;
};

export default AdsterraBanner;