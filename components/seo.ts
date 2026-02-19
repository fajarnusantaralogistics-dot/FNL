import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://fajarnusantaralogistik.com";

type BuildOptions = {
  title: string;
  description: string;
  pathname?: string;
  keywords?: string[];
  image?: string;
};

export function buildMetadata({
  title,
  description,
  pathname = "/",
  keywords = [
    "logistik",
    "ekspedisi",
    "pengiriman",
    "transportasi",
    "Indonesia",
  ],
  image = "/og-image.svg",
}: BuildOptions): Metadata {
  const url = new URL(pathname, SITE_URL).toString();

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: "Fajar Nusantara Logistik",
      images: [
        {
          url: new URL(image, SITE_URL).toString(),
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL(image, SITE_URL).toString()],
    },
    alternates: {
      canonical: url,
    },
  };
}
