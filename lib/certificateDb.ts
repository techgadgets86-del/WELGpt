export interface CertificateData {
  title: string;
  badge: string;
  quote: string;
  description: string;
}

export const CERTIFICATE_DB: Record<string, CertificateData> = {
  "Digital Detox": {
    title: "Digital Zen Master",
    badge: "🧠🔌",
    quote: "Silence is a source of great strength.",
    description: "Awarded for successfully unplugging from the digital matrix and restoring neural baseline dopamine levels."
  },
  "3-Day Juice Cleanse": {
    title: "Cellular Purifier",
    badge: "🥤✨",
    quote: "Let food be thy medicine.",
    description: "Awarded for flooding the biological system with micronutrients and executing a flawless metabolic reset."
  },
  "Heavy Metal Sweep": {
    title: "Iron Sweeper",
    badge: "🔥🧬",
    quote: "Fire forged, pure blooded.",
    description: "Awarded for completing the intense Niacin flush and sauna protocol to excrete heavy metals from the fat cells."
  },
  "Microbiome Reset": {
    title: "Gut Architect",
    badge: "🦠🌿",
    quote: "All disease begins in the gut.",
    description: "Awarded for starving pathogenic bacteria and successfully seeding the microbiome with beneficial flora."
  },
  "Default": {
    title: "Iron Will",
    badge: "🛡️",
    quote: "Discipline equals freedom.",
    description: "Awarded for proving absolute dominance over short-term impulses in pursuit of long-term vitality."
  }
};

export function getCertificateFallback(type: string): CertificateData {
  return CERTIFICATE_DB[type] || CERTIFICATE_DB["Default"];
}
