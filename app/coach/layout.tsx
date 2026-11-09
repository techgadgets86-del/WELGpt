import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WelBuddy Workspace — AI Wellness & Business Co-Pilot",
  description: "Launch WelBuddy: Execute high-priority business tasks, schedule circadian routine blocks, record voice notes, and balance business velocity with mental sanctuary.",
  alternates: {
    canonical: "https://app.welgpt.space/coach",
  },
  openGraph: {
    title: "WelBuddy Workspace — AI Wellness & Business Co-Pilot",
    description: "Launch WelBuddy: Execute high-priority business tasks, schedule circadian routine blocks, and balance business velocity with mental sanctuary.",
    url: "https://app.welgpt.space/coach",
    siteName: "WelBuddy AI",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "WelBuddy Workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WelBuddy Workspace — AI Wellness & Business Co-Pilot",
    description: "Launch WelBuddy: Execute high-priority business tasks, schedule circadian routine blocks, and balance business velocity with mental sanctuary.",
    images: ["/logo-full.png"],
  },
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
