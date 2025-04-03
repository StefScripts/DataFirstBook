import { format, parse, parseISO, addDays as fnsAddDays, isValid, startOfDay as fnsStartOfDay } from 'date-fns';

/**
 * Time slots available for booking
 */
export const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => ({
  value: time,
  label: formatTime(time)
}));

/**
 * Format time from 24-hour format to am/pm format
 * @param time Time string in format "HH:mm"
 * @returns Formatted time string (e.g., "10:00 AM")
 */
export function formatTime(time: string): string {
  if (!time) return '';
  try {
    return format(parse(time, 'HH:mm', new Date()), 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return time;
  }
}

/**
 * Format date to a user-friendly string
 * @param date The date to format
 * @returns Formatted date string (e.g., "Monday, January 1, 2023")
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, 'EEEE, MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format date to compact format
 * @param date The date to format
 * @returns Formatted date string (e.g., "Jan 1, 2023")
 */
export function formatCompactDate(date: Date | string): string {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format day of week in short form (e.g., "Mon", "Tue")
 * @param date The date to format
 * @returns Formatted weekday string (e.g., "Mon")
 */
export function formatWeekday(date: Date | string): string {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'EEE');
  } catch (error) {
    console.error('Error formatting weekday:', error);
    return '';
  }
}

/**
 * Format date and time together
 * @param date The date to format
 * @param time Time string in format "HH:mm"
 * @returns Formatted date and time string
 */
export function formatDateAndTime(date: Date | string, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`;
}

/**
 * Safely parse a date string to a Date object
 * @param dateString Date string to parse
 * @returns Date object or null if invalid
 */
export function safeParseDate(dateString: string): Date | null {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

/**
 * Add days to a date
 * @param date The base date
 * @param days Number of days to add
 * @returns A new Date with the days added
 */
export function addDays(date: Date, days: number): Date {
  return fnsAddDays(date, days);
}

/**
 * Set time to beginning of day (00:00:00.000)
 * @param date The date to set to start of day
 * @returns A new Date set to the beginning of the day
 */
export function startOfDay(date: Date): Date {
  return fnsStartOfDay(date);
}

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns true if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj < today;
}

/**
 * Get the relative time from now (e.g., "2 days ago", "in 3 days")
 * @param date Date to compare
 * @returns String describing the relative time
 */
export function getRelativeTime(date: Date | string): string {
  // In a real implementation, you might use a library like date-fns/formatDistance
  // This is a simplified version
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';

  const now = new Date();
  const diffInDays = Math.floor((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 0) return `In ${diffInDays} days`;
  return `${Math.abs(diffInDays)} days ago`;
}
