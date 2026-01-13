import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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
  title: {
    default: "Loteos Unnamed | Desarrollos Inmobiliarios",
    template: "%s | Loteos Unnamed",
  },
  description:
    "Especialistas en loteos y desarrollos inmobiliarios sustentables. San Matías Arroyo de La Cruz - Tu lugar en el mundo.",
  keywords: [
    "Loteos",
    "Inmobiliaria",
    "San Matías",
    "Arroyo de La Cruz",
    "Exaltación de la Cruz",
    "Terrenos",
    "Inversión",
  ],
  authors: [{ name: "Loteos Unnamed" }],
  creator: "Loteos Unnamed",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Loteos Unnamed",
    title: "Loteos Unnamed | Desarrollos Inmobiliarios",
    description: "Especialistas en loteos y desarrollos inmobiliarios sustentables. San Matías Arroyo de La Cruz.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loteos Unnamed | Desarrollos Inmobiliarios",
    description: "Especialistas en loteos y desarrollos inmobiliarios sustentables.",
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
  name: "Loteos Unnamed",
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
    name: "Loteos Unnamed",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
        </ThemeProvider>
      </body>
    </html>
  );
}
