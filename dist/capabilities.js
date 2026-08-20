export const ALL_CAPABILITIES = [
    "dynamic_code_execution",
    "base64_decode",
];
export function isValidCapability(c) {
    return ALL_CAPABILITIES.includes(c);
}
