import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Routine & Movement Protocols | WelBuddy",
  description: "Design and optimize your daily circadian routines, kinetic exercise protocols, and NSDR resets with WelBuddy AI.",
  alternates: {
    canonical: "https://app.welgpt.space/routine",
  },
  openGraph: {
    title: "Daily Routine & Movement Protocols | WelBuddy",
    description: "Design and optimize your daily circadian routines, kinetic exercise protocols, and NSDR resets with WelBuddy AI.",
    url: "https://app.welgpt.space/routine",
    siteName: "WelBuddy AI",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Daily Routines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Routine & Movement Protocols | WelBuddy",
    description: "Design and optimize your daily circadian routines, kinetic exercise protocols, and NSDR resets with WelBuddy AI.",
    images: ["/logo-full.png"],
  },
};

export default function RoutineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
