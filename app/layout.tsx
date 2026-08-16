import 'katex/dist/katex.min.css';
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { MusicProvider } from "../components/MusicProvider";
import { siteConfig } from "../siteConfig";
import BackgroundSlider from "../components/BackgroundSlider";
import SplashScreen from "../components/SplashScreen";
import ClientDecorations from '../components/ClientDecorations';
import { EffectQualityProvider } from "../components/EffectQualityProvider";
import { ToastProvider } from "../components/ToastProvider";
import SiteChrome from "../components/SiteChrome";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.authorName}`,
  },
  description: siteConfig.bio,
  authors: [{ name: siteConfig.authorName, url: siteConfig.social.github }],
  creator: siteConfig.authorName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteConfig.siteUrl,
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.bio,
    images: [{ url: siteConfig.defaultPostCover, alt: `${siteConfig.authorName} Blog` }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.bio,
    images: [siteConfig.defaultPostCover],
  },
  robots: { index: true, follow: true },
  icons: { icon: siteConfig.faviconUrl, apple: siteConfig.faviconUrl },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Set the theme class before first paint to avoid flash — WITHOUT hiding the whole app */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('blog-theme');var d=document.documentElement;if(t==='dark'){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){document.documentElement.classList.remove('dark');}})();`,
          }}
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var q=r?'static':(window.innerWidth<768||(navigator.hardwareConcurrency||4)<=4?'low':'high');d.classList.remove('effects-high','effects-low','effects-static','effects-paused');d.classList.add('effects-'+q);if(document.hidden)d.classList.add('effects-paused');})();`,
          }}
        />
      </head>
      <body className="w-screen overflow-x-hidden min-h-full flex flex-col relative transition-colors duration-300 font-serif warm-page-surface">
        <ThemeProvider>
          <EffectQualityProvider>
            <SplashScreen />
            <MusicProvider>
              <div id="app-mount-root" className="flex-1 flex flex-col min-h-screen">
                <div className="effect-layer fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                  {!siteConfig.useGradient && <BackgroundSlider />}
                  <div className="absolute inset-0 z-[-9] bg-[#f7fcff]/70 dark:bg-slate-950/35 transition-colors duration-300"></div>
                  <div className="site-gradient-layer" style={{ background: `linear-gradient(-45deg, ${siteConfig.themeColors.join(', ')})` }} />
                  <div className="site-ambient-glow" />
                </div>
                <ClientDecorations />

                <ToastProvider>
                  <SiteChrome />
                  <div className="relative z-10 flex-1 flex flex-col">{children}</div>
                  <SiteFooter />
                </ToastProvider>
              </div>
            </MusicProvider>
          </EffectQualityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
