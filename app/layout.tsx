import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { fragment } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SRS Diamonds | Natural Polished Diamonds, Antwerp",
    template: "%s | SRS Diamonds",
  },
  description:
    "Family-run Antwerp diamond house since 2012. Natural, polished diamonds at one uncompromising standard. From calibrated parcels to GIA certified stones. Purpose in Every Stone.",
  icons: {
    icon: "/favicon.png?v=4",
    apple: "/apple-touch-icon.png?v=1",
  },
};

// Runs before GTranslate loads: keeps the site in English on a fresh visit or
// browser refresh, but restores the chosen language when navigating between
// pages within a session (cookie set/cleared before the engine reads it).
const LANG_EARLY = `(function(){try{
var parts=location.hostname.split('.');var doms=[''];
for(var i=0;i<parts.length-1;i++)doms.push('.'+parts.slice(i).join('.'));
function clearC(){var p='Thu, 01 Jan 1970 00:00:00 UTC';doms.forEach(function(d){document.cookie='googtrans=;expires='+p+';path=/'+(d?';domain='+d:'');});}
function setC(c){clearC();if(c==='en')return;var v='/en/'+c;doms.forEach(function(d){document.cookie='googtrans='+v+';path=/'+(d?';domain='+d:'');});}
var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0]);
var t=nav?nav.type:((performance.navigation&&performance.navigation.type===1)?'reload':'navigate');
var s=null;try{s=sessionStorage.getItem('srsLang');}catch(e){}
var ok=['fr','it','es','nl','ar'];
if(t==='reload'||!s||ok.indexOf(s)<0){try{sessionStorage.removeItem('srsLang');}catch(e){}clearC();}
else{setC(s);}
}catch(e){}})();`;

const GTRANSLATE_SETTINGS = `window.gtranslateSettings = {"default_language":"en","native_language_names":true,"languages":["en","fr","it","es","nl","ar"],"wrapper_selector":".gtranslate_wrapper","select_language_label":"EN"}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400&display=swap"
          rel="stylesheet"
        />
        <Script id="srs-lang-early" strategy="beforeInteractive">
          {LANG_EARLY}
        </Script>
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: fragment("_header") }} />
        {children}
        <div dangerouslySetInnerHTML={{ __html: fragment("_footer") }} />
        <div className="gtranslate_wrapper" />

        <Script src="/site.js" strategy="afterInteractive" />
        <Script id="gtranslate-settings" strategy="afterInteractive">
          {GTRANSLATE_SETTINGS}
        </Script>
        <Script
          src="https://cdn.gtranslate.net/widgets/latest/dropdown.js"
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  );
}
