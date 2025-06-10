"use client";

import { useEffect } from "react";

export default function AdSenseScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4730115642307104";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);

  return null;
}
