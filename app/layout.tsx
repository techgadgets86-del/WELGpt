import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

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
  title: "WelGPT - Your AI Wellness Coach",
  description: "One personalized plan for your mind, movement, nutrition and daily habits—adapted as you progress.",
  keywords: ["AI Coach", "Wellness Tracker", "Digital Detox", "Routine Builder", "WelGPT", "Habit Tracker"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WelGPT",
  },
  openGraph: {
    title: "WelGPT - Your AI Wellness Coach",
    description: "One personalized plan for your mind, movement, nutrition and daily habits.",
    url: "https://app.welgpt.space",
    siteName: "WelGPT App",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WelGPT - AI Wellness Coach",
    description: "Reclaim your attention and build unbreakable routines.",
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
          <ProtectedRoute>
            <AppLayout>{children}</AppLayout>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
