/**
 * Returns the base URL for API calls.
 * - In local development (Vite dev server), returns '' so Vite proxy handles /api → localhost:5000
 * - In production (Vercel), VITE_API_URL must be set to the Render backend URL
 *   e.g. https://rms-platform-backend.onrender.com
 */
export const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

/**
 * Convenience wrapper — prepends the correct base URL to any /api path.
 * @param {string} path  e.g. '/api/auth/login'
 * @returns {string}
 */
export function apiUrl(path) {
  return `${API_BASE}${path}`
}

/**
 * Drop-in replacement for fetch() that automatically prefixes the correct backend URL.
 * Usage: apiFetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
 *
 * @param {string} path   Must start with '/api'
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export function apiFetch(path, options = {}) {
  return fetch(apiUrl(path), options)
}
