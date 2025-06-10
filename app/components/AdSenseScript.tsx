import Script from "next/script";

export default function AdSenseHeadScript() {
  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4730115642307104"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error("AdSense script failed to load", e);
        }}
      />
      <Script
        id="adsbygoogle-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `,
        }}
      />
    </>
  );
}
