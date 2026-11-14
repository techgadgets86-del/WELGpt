import AnalyticsDashboard from "../analytics/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-App Command Center | WelGPT & DilSEV Live Telemetry",
  description: "Executive live tracking, real-time analytics, user retention, and security intelligence for WelGPT and DilSEV.",
};

export default function CommandCenterPage() {
  return <AnalyticsDashboard mode="multi-app" />;
}
