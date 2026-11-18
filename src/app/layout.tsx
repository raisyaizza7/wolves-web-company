import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://wolvesbogor.id"),
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "Wolves Basketball",
    "Wolves Kab Bogor",
    "Klub Basket Bogor",
    "Akademi Basket Pakansari",
    "Perbasi Kabupaten Bogor",
    "Sewa Lapangan Basket Pakansari",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - Official Club`,
    description: siteConfig.description,
    url: "https://wolvesbogor.id",
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-basketball.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-surface-container-lowest font-body text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
