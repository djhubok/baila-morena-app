import type { Metadata } from "next";
import { Anton, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const inter = Inter({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baila-morena-app.vercel.app"),
  title: "BAILA MORENA — El reggaetón old school volvió",
  description:
    "La fiesta donde el reggaetón old school vuelve a ser protagonista. Clásicos, nostalgia y una energía única en cada edición.",
  openGraph: {
    title: "BAILA MORENA",
    description:
      "La fiesta donde el reggaetón old school vuelve a ser protagonista.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Baila Morena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAILA MORENA",
    description:
      "La fiesta donde el reggaetón old school vuelve a ser protagonista.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${anton.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
