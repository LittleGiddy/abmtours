// components/AdsterraBanner.tsx
"use client";
import React, { useEffect, useRef } from "react";

const AdsterraBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || adRef.current.hasChildNodes()) return;

    const atOptions = {
      key: 'a76e1d096eab2353ff5c7af1f6d5ff0f',
      format: 'iframe',
      height: 50,
      width: 320,
      params: {}
    };

    const configScript = document.createElement("script");
    configScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://www.highperformanceformat.com/a76e1d096eab2353ff5c7af1f6d5ff0f/invoke.js";

    adRef.current.appendChild(configScript);
    adRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div 
      ref={adRef} 
      className="flex justify-center items-center my-4"
      style={{ minHeight: '50px' }}
    />
  );
};

export default AdsterraBanner;