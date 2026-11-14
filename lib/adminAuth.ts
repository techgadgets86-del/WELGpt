/**
 * Client-safe admin authorization and company email verification utility for WelGPT.
 * Safe to import in both client components and server environments.
 */

export const OFFICIAL_COMPANY_DOMAINS = ["welgpt.space", "welgpt.com"];

export const DEFAULT_ADMIN_EMAILS = [
  "admin@welgpt.space",
  "support@welgpt.space",
  "contact@welgpt.com",
  "techgadgets86@gmail.com",
];

/**
 * Checks whether an email belongs to an official company admin.
 * Matches:
 * 1. Configured environment variables (NEXT_PUBLIC_ADMIN_EMAILS / ADMIN_EMAILS)
 * 2. Official company domain emails (@welgpt.space, @welgpt.com)
 * 3. Default designated administrator emails
 */
export function isOfficialAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check environment variable overrides (comma-separated)
  const envAdmins = [
    ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || []),
    ...(process.env.ADMIN_EMAILS?.split(",") || []),
  ]
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAdmins.includes(cleanEmail)) {
    return true;
  }

  // 2. Check default administrator emails
  if (DEFAULT_ADMIN_EMAILS.includes(cleanEmail)) {
    return true;
  }

  // 3. Check official company domains (@welgpt.space, @welgpt.com)
  const domain = cleanEmail.split("@")[1];
  if (domain && OFFICIAL_COMPANY_DOMAINS.includes(domain)) {
    return true;
  }

  return false;
}
