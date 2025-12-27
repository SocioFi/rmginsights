// Subscription utility functions
// Centralized logic for checking subscription tiers and features

export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface UserProfile {
  subscription_tier?: SubscriptionTier;
  tier?: SubscriptionTier;
  subscription_status?: string;
  [key: string]: any;
}

/**
 * Get subscription tier from user profile
 */
export function getSubscriptionTier(user: any, profile?: UserProfile | null): SubscriptionTier {
  // First check if profile is provided and has subscription_tier
  if (profile?.subscription_tier) {
    return profile.subscription_tier;
  }
  
  // Check profile.tier (fallback)
  if (profile?.tier) {
    return profile.tier;
  }
  
  // Check user object for subscription data
  if (user?.subscription?.subscription_tier) {
    return user.subscription.subscription_tier;
  }
  
  if (user?.subscription?.tier) {
    return user.subscription.tier;
  }
  
  // Default to free
  return 'free';
}

/**
 * Check if user has Pro tier or higher
 */
export function hasProTier(user: any, profile?: UserProfile | null): boolean {
  const tier = getSubscriptionTier(user, profile);
  return tier === 'pro' || tier === 'business';
}

/**
 * Check if user has Business tier
 */
export function hasBusinessTier(user: any, profile?: UserProfile | null): boolean {
  const tier = getSubscriptionTier(user, profile);
  return tier === 'business';
}

/**
 * Check if user can access preference-based personalization (Pro+)
 */
export function canPersonalizeByPreferences(user: any, profile?: UserProfile | null): boolean {
  return hasProTier(user, profile);
}

/**
 * Check if user can access Market/Business/Industry Copilots (Business tier)
 */
export function canAccessCopilots(user: any, profile?: UserProfile | null): boolean {
  return hasBusinessTier(user, profile);
}

