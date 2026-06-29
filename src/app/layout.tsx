import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { sharedOpenGraphImage, sharedTwitterImage } from "@/lib/seo";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://fitzroyadesarrollos.com"
  ),
  title: {
    default: "Fitzroya Desarrollos | Desarrollos Inmobiliarios",
    template: "%s | Fitzroya Desarrollos",
  },
  description:
    "Especialistas en loteos y desarrollos inmobiliarios sustentables. Jardines de Arroyo - Arroyo de La Cruz - Tu lugar en el mundo.",
  keywords: [
    "Fitzroya",
    "Desarrollos",
    "Inmobiliaria",
    "Jardines de Arroyo",
    "Arroyo de La Cruz",
    "Exaltación de la Cruz",
    "Terrenos",
    "Inversión",
  ],
  authors: [{ name: "Fitzroya Desarrollos" }],
  creator: "Fitzroya Desarrollos",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Fitzroya Desarrollos",
    title: "Fitzroya Desarrollos | Desarrollos Inmobiliarios",
    description:
      "Especialistas en loteos y desarrollos inmobiliarios sustentables. Jardines de Arroyo - Arroyo de La Cruz.",
    images: [sharedOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitzroya Desarrollos | Desarrollos Inmobiliarios",
    description:
      "Especialistas en loteos y desarrollos inmobiliarios sustentables.",
    images: [sharedTwitterImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fitzroya Desarrollos",
  description:
    "Especialistas en loteos y desarrollos inmobiliarios sustentables.",
  applicationCategory: "RealEstateApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "17500",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Fitzroya Desarrollos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P3BQPKH4');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P3BQPKH4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-right" />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
