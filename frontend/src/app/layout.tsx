import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/providers";


export const metadata: Metadata = {
  title: "Emissia — Satellite CO₂ Emission Intelligence",
  description:
    "Predict industrial CO₂ emissions from satellite imagery using machine learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
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
