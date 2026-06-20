import { _DecryptService } from '../services/cryptoService';

/**
 * Decode a JWT payload without verifying the signature.
 * Returns the parsed payload object, or null on failure.
 */
export const decodeJWT = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    // Make the base64 URL-safe string standard before decoding
    const normalized    = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

/**
 * Get the raw (decrypted) token from sessionStorage.
 */
export const getRawToken = () => {
  const encrypted = sessionStorage.getItem('pos_token');
  if (!encrypted) return null;
  return _DecryptService(encrypted);
};

/**
 * Get the user role stored in sessionStorage.
 * Returns 'admin' | 'cashier' | null
 */
export const getUserRole = () => sessionStorage.getItem('pos_role');

/**
 * Returns true if the user is authenticated.
 */
export const isAuthenticated = () => !!sessionStorage.getItem('pos_token');

/**
 * Clear all auth data (used on logout).
 */
export const clearAuth = () => {
  sessionStorage.removeItem('pos_token');
  sessionStorage.removeItem('pos_role');
};