import type { Metadata } from "next";
import { Fraunces, Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import Script from "next/script";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["italic", "normal"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emissia — Satellite CO₂ Emission Intelligence",
  description:
    "Predict industrial CO₂ emissions from satellite imagery using machine learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('settings_appearance_theme') || 'dark';
                  var html = document.documentElement;
                  if (theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                    html.classList.add('light');
                    html.classList.remove('dark');
                  } else {
                    html.classList.add('dark');
                    html.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body
        className="antialiased"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
