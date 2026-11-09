import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Wellness Modules & WelBuddy AI | WelGPT",
  description: "Explore all evidence-informed wellness modules: WelBuddy AI Co-Pilot, Nutrition Protocols, Sensei Workouts, Meditation, and Dopamine Detox Resets.",
  alternates: {
    canonical: "https://app.welgpt.space/explore",
  },
  openGraph: {
    title: "Explore Wellness Modules & WelBuddy AI | WelGPT",
    description: "Explore all evidence-informed wellness modules: WelBuddy AI Co-Pilot, Nutrition Protocols, Sensei Workouts, Meditation, and Dopamine Detox Resets.",
    url: "https://app.welgpt.space/explore",
    siteName: "WelBuddy AI",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Explore WelGPT Modules",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Wellness Modules & WelBuddy AI | WelGPT",
    description: "Explore all evidence-informed wellness modules: WelBuddy AI Co-Pilot, Nutrition Protocols, Sensei Workouts, and Meditation.",
    images: ["/logo-full.png"],
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
