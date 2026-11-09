import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WelBuddy AI — The Best AI Assistant for Mental & Business Wellness",
  description: "Meet WelBuddy: The premier AI assistant engineered to balance peak business performance with nervous system recovery. Features daily routine sync, executive tasks, and lock-screen alerts.",
  alternates: {
    canonical: "https://app.welgpt.space/welbuddy",
  },
  keywords: [
    "WelBuddy",
    "WelBuddy AI",
    "WelBuddy App",
    "WelBuddy AI Assistant",
    "Best AI Assistant for Wellness",
    "AI Mental and Business Wellness",
    "Business Wellness Co-Pilot",
    "Executive Routine Scheduler",
    "Circadian Rhythm App",
    "Dopamine Detox AI",
    "Lock-Screen Wellness Notifications",
  ],
  openGraph: {
    title: "WelBuddy AI — The Best AI Assistant for Mental & Business Wellness",
    description: "Your executive AI wellness co-pilot engineered to balance peak business performance with nervous system sanctuary.",
    url: "https://app.welgpt.space/welbuddy",
    siteName: "WelBuddy AI",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "WelBuddy AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WelBuddy AI — The Best AI Assistant for Mental & Business Wellness",
    description: "The premier AI assistant for the wellness of your mental & business life.",
    images: ["/logo-full.png"],
  },
};

export default function WelBuddyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
