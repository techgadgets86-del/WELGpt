import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dopamine Detox & Focus Sanctuary | WelBuddy",
  description: "Block cheap dopamine, eliminate distractions, enter high-velocity focus sprints, and reset your neural baseline with WelBuddy AI.",
  alternates: {
    canonical: "https://app.welgpt.space/detox",
  },
  openGraph: {
    title: "Dopamine Detox & Focus Sanctuary | WelBuddy",
    description: "Block cheap dopamine, eliminate distractions, enter high-velocity focus sprints, and reset your neural baseline with WelBuddy AI.",
    url: "https://app.welgpt.space/detox",
    siteName: "WelBuddy AI",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Dopamine Detox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dopamine Detox & Focus Sanctuary | WelBuddy",
    description: "Block cheap dopamine, eliminate distractions, and reset your neural baseline with WelBuddy AI.",
    images: ["/logo-full.png"],
  },
};

export default function DetoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
