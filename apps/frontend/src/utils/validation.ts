/**
 * Email validation regex following standard email RFC structure:
 * Requires local-part, @, domain name, and at least a 2-character TLD.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

/**
 * Validates an email address.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateEmail(email: string): string | null {
  const clean = email.trim();
  if (!clean) {
    return 'Email address is required';
  }
  if (clean.length > 255) {
    return 'Email address cannot exceed 255 characters';
  }
  if (!EMAIL_REGEX.test(clean)) {
    return 'Please enter a valid email address (e.g. alex@example.com)';
  }
  return null;
}

/**
 * Validates a username.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateUsername(username: string): string | null {
  const clean = username.trim();
  if (!clean) {
    return 'Username is required';
  }
  if (clean.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (clean.length > 30) {
    return 'Username cannot exceed 30 characters';
  }
  if (!USERNAME_REGEX.test(clean)) {
    return 'Username can only contain letters, numbers, underscores, dots, or hyphens';
  }
  return null;
}

/**
 * Validates a password.
 * Returns null if valid, or an error message string if invalid.
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (password.length > 100) {
    return 'Password cannot exceed 100 characters';
  }
  return null;
}

/**
 * Validates a login identifier (which can be either an email address or username).
 * Returns null if valid, or an error message string if invalid.
 */
export function validateLoginIdentifier(identifier: string): string | null {
  const clean = identifier.trim();
  if (!clean) {
    return 'Email or username is required';
  }
  if (clean.includes('@')) {
    if (!EMAIL_REGEX.test(clean)) {
      return 'Please enter a valid email address';
    }
  } else if (clean.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  return null;
}
