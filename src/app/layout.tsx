import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Fraunces, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Healing Hands Spa — Health and wellness · Middletown, DE",
    template: "%s · Healing Hands Spa",
  },
  description:
    "Bookings, products, and CEU classes from Healing Hands Spa in Middletown, Delaware. Massage therapy, prenatal care, and the Essentially Yours line of essential oils and healing lotions.",
  applicationName: "Healing Hands Spa",
  keywords: [
    "spa",
    "massage Middletown DE",
    "Swedish massage",
    "prenatal massage",
    "essential oils",
    "Essentially Yours",
    "CEU massage class Delaware",
  ],
  openGraph: {
    title: "Healing Hands Spa — Book appointment",
    description:
      "Massage therapy, prenatal care, CEU classes, and the Essentially Yours line of healing products from Middletown, Delaware.",
    siteName: "Healing Hands Spa",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        {/* JSON-LD: LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              name: "Healing Hands Spa",
              image: "/favicon.ico",
              "@id": "https://healinghandsspa.com",
              telephone: "(302) 555-0139",
              address: {
                "@type": "PostalAddress",
                streetAddress: "327 Main Street",
                addressLocality: "Middletown",
                addressRegion: "DE",
                postalCode: "19709",
                addressCountry: "US",
              },
              openingHours: "Tu-Sa 09:00-18:00",
              priceRange: "$$",
            }),
          }}
        />
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-sage-700 focus:px-4 focus:py-2 focus:text-cream-50"
              >
                Skip to content
              </a>
              <Navbar />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
              <CookieConsent />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
