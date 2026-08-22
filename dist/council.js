// ---- Council Types ----
// ---- Defaults ----
export const SIDECAR_DEFAULTS = {
    connectionProfileId: "",
    model: "",
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 1024,
};
/** @deprecated Use `SIDECAR_DEFAULTS` instead. */
export const COUNCIL_SIDECAR_DEFAULTS = { ...SIDECAR_DEFAULTS };
export const COUNCIL_TOOLS_DEFAULTS = {
    mode: "sidecar",
    timeoutMs: 30000,
    sidecarContextWindow: 25,
    excludeLatestUserMessage: false,
    includeUserPersona: true,
    includeCharacterInfo: true,
    includeWorldInfo: true,
    allowUserControl: false,
    maxWordsPerTool: 250,
    retainResultsForRegens: false,
};
export const COUNCIL_SETTINGS_DEFAULTS = {
    councilMode: false,
    members: [],
    toolsSettings: { ...COUNCIL_TOOLS_DEFAULTS },
};
