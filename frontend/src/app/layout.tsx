import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";


export const metadata: Metadata = {
  title: "Emissia — Satellite CO₂ Emission Intelligence",
  description:
    "Predict industrial CO₂ emissions from satellite imagery using machine learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
