"use client";
import Head from "next/head";

export default function AdSenseScript() {
  return (
    <Head>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4730115642307104"
        crossOrigin="anonymous"
      ></script>
    </Head>
  );
}
