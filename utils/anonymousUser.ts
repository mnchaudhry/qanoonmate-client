/**
 * Utility for managing anonymous user sessions for chatbot
 * Creates and persists anonymous user IDs in localStorage
 */

const ANONYMOUS_USER_KEY = "qanoonmate_anonymous_user_id";

/**
 * Generates a unique anonymous user ID
 * Format: anon_<timestamp>_<random>
 */
export const generateAnonymousUserId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${random}`;
};

/**
 * Gets or creates an anonymous user ID
 * Persists the ID in localStorage for future sessions
 */
export const getOrCreateAnonymousUserId = (): string => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    // Server-side rendering - generate temporary ID
    return generateAnonymousUserId();
  }

  try {
    // Try to get existing anonymous user ID
    let anonymousUserId = localStorage.getItem(ANONYMOUS_USER_KEY);

    if (!anonymousUserId) {
      // Generate new anonymous user ID
      anonymousUserId = generateAnonymousUserId();
      localStorage.setItem(ANONYMOUS_USER_KEY, anonymousUserId);
    }

    return anonymousUserId;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    // Fallback to generating a temporary ID
    return generateAnonymousUserId();
  }
};

/**
 * Clears the anonymous user ID (useful when user signs in)
 */
export const clearAnonymousUserId = (): void => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(ANONYMOUS_USER_KEY);
    } catch (error) {
      console.error("Error clearing anonymous user ID:", error);
    }
  }
};

/**
 * Checks if a user ID is an anonymous ID
 */
export const isAnonymousUserId = (userId: string): boolean => {
  return userId?.startsWith("anon_") || false;
};
