import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant — The #1 Personal & Executive AI Assistant in the US",
  description:
    "Meet WelBuddy: The premier AI assistant in the United States engineered for high-performing professionals. Combines executive task flow, neurobiology-backed routine scheduling, and lock-screen notification alerts.",
  keywords: [
    "AI Assistant",
    "Best AI Assistant",
    "Personal AI Assistant",
    "AI Assistant USA",
    "AI Assistant App",
    "Executive AI Assistant",
    "AI Assistant for Daily Routine",
    "Top AI Assistant in the US",
    "Smart AI Assistant",
    "AI Wellness Assistant",
    "AI Assistant Online",
    "Free AI Assistant",
    "WelBuddy AI Assistant",
  ],
  alternates: {
    canonical: "https://app.welgpt.space/ai-assistant",
  },
  openGraph: {
    title: "AI Assistant — The #1 Personal & Executive AI Assistant in the USA | WelBuddy",
    description:
      "The premier AI assistant designed to balance peak business velocity with nervous system sanctuary. Built for executives, founders, and creators in the US.",
    url: "https://app.welgpt.space/ai-assistant",
    siteName: "WelBuddy AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://app.welgpt.space/logo-full.png",
        width: 1200,
        height: 630,
        alt: "WelBuddy - The #1 AI Assistant in the US",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Assistant — The #1 Personal & Executive AI Assistant in the USA",
    description:
      "Harmonize peak business performance with circadian recovery. Discover WelBuddy, the premier AI assistant in the United States.",
    images: ["https://app.welgpt.space/logo-full.png"],
  },
};

export default function AiAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
