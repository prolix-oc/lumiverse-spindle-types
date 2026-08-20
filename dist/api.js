/**
 * Structured error code included in permission-denied error messages.
 * Extensions can check `error.startsWith("PERMISSION_DENIED:")` to
 * programmatically distinguish permission errors from runtime failures.
 */
export const PERMISSION_DENIED_PREFIX = "PERMISSION_DENIED:";
