import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neuroscience Library & Behavioral Protocols | WelBuddy",
  description: "Explore deep-dive neuroscience guides on dopamine detoxing, natural melatonin optimization, adenosine clearing, and adult neuroplasticity from WelBuddy AI.",
  alternates: {
    canonical: "https://app.welgpt.space/blog",
  },
  openGraph: {
    title: "Neuroscience Library & Behavioral Protocols | WelBuddy",
    description: "Explore deep-dive neuroscience guides on dopamine detoxing, natural melatonin optimization, adenosine clearing, and adult neuroplasticity from WelBuddy AI.",
    url: "https://app.welgpt.space/blog",
    siteName: "WelBuddy AI",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "WelBuddy Neuroscience Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuroscience Library & Behavioral Protocols | WelBuddy",
    description: "Explore deep-dive neuroscience guides on dopamine detoxing, natural melatonin optimization, and neuroplasticity from WelBuddy AI.",
    images: ["/logo-full.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
