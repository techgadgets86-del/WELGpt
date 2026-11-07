import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnalyticsTracker from "@/lib/analyticsTracker";

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
  title: "WelGPT - WelBuddy AI Mental & Business Co-Pilot",
  description: "The best AI assistant for the wellness of your mental & business life. One personalized plan adapted as you progress.",
  keywords: ["WelBuddy", "AI Wellness Assistant", "Business Wellness", "Mental Sanctuary", "Digital Detox", "Routine Builder", "WelGPT", "Habit Tracker"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WelGPT",
  },
  openGraph: {
    title: "WelGPT - WelBuddy AI Mental & Business Co-Pilot",
    description: "The best AI assistant for the wellness of your mental & business life.",
    url: "https://app.welgpt.space",
    siteName: "WelGPT App",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WelGPT - WelBuddy AI Co-Pilot",
    description: "The best AI assistant for the wellness of your mental & business life.",
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
