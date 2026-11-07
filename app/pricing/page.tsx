import { headers } from "next/headers";
import PricingClient from "./PricingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | WelGPT",
  description:
    "Choose your tier to unlock WelBuddy, adaptive routines, and focus tracking. Transparent, country-localized pricing with no hidden fees.",
};

export default async function PricingPage() {
  const headersList = await headers();
  // Vercel sets 'x-vercel-ip-country' (2-letter ISO code e.g. 'US', 'PK', 'GB')
  // Cloudflare sets 'cf-ipcountry'
  const countryHeader =
    headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry");

  // Validate that it's a genuine 2-letter ISO country code.
  // Never pass internal/unknown sentinels (e.g., 'XX', 'T1', 'OTHERS') to Paddle.
  const initialCountry =
    countryHeader &&
    countryHeader.length === 2 &&
    countryHeader !== "XX" &&
    countryHeader !== "T1"
      ? countryHeader.toUpperCase()
      : undefined;

  return <PricingClient initialCountry={initialCountry} />;
}
