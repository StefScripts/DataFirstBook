/**
 * API client for making requests to the backend
 * This utility handles environment-specific API URLs
 */

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Build a full URL for API requests
 * If API_URL is set, it will be prepended to the path
 * Otherwise, the path will be used as-is (for local development with proxy)
 */
export function buildApiUrl(path: string): string {
  // If path already starts with http, return as-is
  if (path.startsWith('http')) {
    return path;
  }

  // If no API_URL is set, return the path (for local dev proxy)
  if (!API_URL) {
    return path;
  }

  // Handle paths that might or might not start with '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

/**
 * Enhanced fetch function that uses the API URL
 * - Automatically builds the correct URL
 * - Handles JSON responses
 * - Includes credentials
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = buildApiUrl(path);

  // Add default options
  const fetchOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, fetchOptions);

  // Handle non-OK responses
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      throw e;
    }
  }

  // For 204 No Content responses, return null
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
