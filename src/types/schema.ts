// Client-side type definitions for server data types
// This file replaces imports from @db/schema

/**
 * User data structure
 */
export interface SelectUser {
  id: number;
  username: string;
  // Note: password is omitted for security reasons
}

/**
 * Booking data structure
 */
export interface Booking {
  id: number;
  name: string;
  email: string;
  company: string;
  message?: string;
  date: string;
  time: string;
  confirmationToken?: string;
  confirmed: boolean;
  cancelled: boolean;
  createdAt: string;
}

/**
 * Blocked slot data structure
 */
export interface BlockedSlot {
  id: number;
  date: string;
  time: string;
  reason: string;
  createdAt: string;
}

/**
 * Password reset token data structure
 */
export interface PasswordResetToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}
