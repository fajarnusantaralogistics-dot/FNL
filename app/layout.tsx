import type { Metadata } from "next";
import { LanguageProvider } from "@/providers/language-provider";
import "@/styles/globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fajarnusantaralogistik.com/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fajar Nusantara Logistik - Solusi Pengiriman Terpercaya",
    template: "%s | Fajar Nusantara Logistik",
  },
  description:
    "Layanan logistik dan ekspedisi terpercaya untuk pengiriman barang, kendaraan, dan alat berat ke seluruh Indonesia.",
  keywords: [
    "logistik",
    "ekspedisi",
    "pengiriman",
    "transportasi",
    "Indonesia",
  ],
  applicationName: "Fajar Nusantara Logistik",
  authors: [{ name: "Fajar Nusantara Logistik" }],
  openGraph: {
    title: "Fajar Nusantara Logistik",
    description:
      "Layanan logistik dan ekspedisi terpercaya untuk pengiriman barang, kendaraan, dan alat berat ke seluruh Indonesia.",
    url: SITE_URL,
    siteName: "Fajar Nusantara Logistik",
    images: [
      {
        url: "/og-image.svg",
        alt: "Fajar Nusantara Logistik",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fajar Nusantara Logistik",
    description:
      "Layanan logistik dan ekspedisi terpercaya untuk pengiriman barang, kendaraan, dan alat berat ke seluruh Indonesia.",
    images: ["/og-image.svg"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fajar Nusantara Logistik",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.svg`,
    description:
      "Layanan logistik dan ekspedisi terpercaya untuk pengiriman barang, kendaraan, dan alat berat ke seluruh Indonesia.",
    sameAs: [],
  };

  return (
    <html lang="id">
      <body>
        <LanguageProvider>
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
