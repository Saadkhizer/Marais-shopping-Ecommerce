/**
 * Validation shared between the auth pages and checkout, so a rule is written
 * once and every form agrees on it.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "That does not look like a valid email address.";
  if (email.length > 254) return "That email address is too long.";
  return null;
}

export function validatePassword(value) {
  if (!value) return "Enter a password.";
  if (value.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return "Include at least one letter and one number.";
  }
  return null;
}

export function validateRequired(value, label) {
  return value.trim() ? null : `Enter your ${label}.`;
}

export function validatePostcode(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your postal code.";
  if (trimmed.length < 3 || trimmed.length > 12) return "Check the postal code.";
  return null;
}

/** Runs a map of field to validator and returns only the fields that failed. */
export function collectErrors(checks) {
  const errors = {};
  for (const [field, result] of Object.entries(checks)) {
    if (result) errors[field] = result;
  }
  return errors;
}
