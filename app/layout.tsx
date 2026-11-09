import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnalyticsTracker from "@/lib/analyticsTracker";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://app.welgpt.space'),
  title: {
    default: "WelBuddy AI — The Best AI Assistant for Mental & Business Wellness | WelGPT",
    template: "%s | WelBuddy AI",
  },
  description: "Meet WelBuddy, the premier AI assistant for the wellness of your mental & business life. Harmonize high-leverage business tasks with circadian routines, NSDR recovery, and lock-screen alerts.",
  applicationName: "WelBuddy AI",
  keywords: [
    "WelBuddy",
    "WelBuddy AI",
    "WelBuddy AI Assistant",
    "WelBuddy App",
    "WelBuddy Co-Pilot",
    "WelGPT",
    "Best AI Assistant for Wellness",
    "AI Mental and Business Wellness",
    "Business Wellness Co-Pilot",
    "Executive Routine Scheduler",
    "Circadian Rhythm App",
    "Dopamine Detox AI",
    "Nervous System Recovery",
    "Habit Tracker",
    "Lock-Screen Wellness Notifications",
  ],
  authors: [{ name: "WelGPT Team", url: "https://app.welgpt.space" }],
  creator: "WelGPT",
  publisher: "WelGPT",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://app.welgpt.space",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WelBuddy",
  },
  openGraph: {
    title: "WelBuddy AI — The Best AI Assistant for Mental & Business Wellness",
    description: "Your executive AI wellness co-pilot engineered to balance peak business performance with nervous system sanctuary.",
    url: "https://app.welgpt.space",
    siteName: "WelBuddy AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "WelBuddy AI — Mental & Business Wellness Co-Pilot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WelBuddy AI — The Best AI Assistant for Mental & Business Wellness",
    description: "The premier AI assistant for the wellness of your mental & business life. One personalized plan adapted as you progress.",
    images: ["/logo-full.png"],
    creator: "@welgpt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="h-full bg-[#0a0a1a]">
        <AuthProvider>
          <AnalyticsTracker />
          <ProtectedRoute>
            <AppLayout>{children}</AppLayout>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
