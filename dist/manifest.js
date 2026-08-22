/** Regex for validating extension identifiers */
export const IDENTIFIER_PATTERN = /^[a-z][a-z0-9_]*$/;
export function validateIdentifier(id) {
    return IDENTIFIER_PATTERN.test(id);
}
