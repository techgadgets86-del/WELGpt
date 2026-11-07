/**
 * Paddle Database Mirroring Types & Access Granting Helper
 */

export interface CustomerRecord {
  customer_id: string;
  email: string;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRecord {
  subscription_id: string;
  customer_id: string;
  status: string;
  price_id: string;
  product_id: string;
  scheduled_change_action: string | null;
  scheduled_change_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Access Helper: Decides whether a subscription currently grants paid access.
 * 
 * Rules:
 * - Treat 'active' AND 'trialing' as access-granting.
 * - Do NOT revoke access just because a 'scheduled_change' to cancel or pause exists.
 *   Access continues until the billing period ends and status becomes 'canceled'.
 * - Only revoke when 'status' is actually 'canceled'.
 * - 'past_due' and 'paused' do not grant access unless payment clears or subscription resumes.
 */
export function isSubscriptionAccessGranted(
  status: string | null | undefined,
  scheduledChange?: { action: string; effectiveAt?: string } | null
): boolean {
  if (!status) return false;
  const s = status.toLowerCase().trim();

  // 'active' and 'trialing' grant full access, even if a scheduled change is pending
  if (s === 'active' || s === 'trialing') {
    return true;
  }

  // 'canceled', 'past_due', 'paused' revoke access
  return false;
}
