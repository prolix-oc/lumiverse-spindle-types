export const SPINDLE_HOST_CAPABILITIES = Object.freeze({
  "preset-extension-data-v1": 1,
  "preset-editor-v1": 1,
  "loom-block-editor-v1": 1,
  "loom-block-management-v1": 1,
  "generation-assembly-v1": 1,
  "interceptor-context-v1": 1,
  "interceptor-final-response-v1": 1,
  "connection-dispatch-resolution-v1": 1,
  "text-editor-close-v1": 1,
}) as Readonly<Record<string, number>>;
/** Structured error code returned when host compatibility validation fails. */
export const SPINDLE_COMPATIBILITY_ERROR_CODE = "SPINDLE_COMPATIBILITY_ERROR" as const;

/**
 * Immutable host/runtime compatibility information exposed to extensions.
 *
 * Hosts may add capability keys over time. Extensions should only depend on
 * the capability names they understand and the descriptor version they support.
 */
export interface SpindleHostDescriptorV1 {
  readonly descriptorVersion: 1;
  readonly lumiverseVersion: string;
  readonly capabilities: Readonly<Record<string, number>>;
  readonly extensionInstallationId: string;
}

/** Locale identifiers supplied by the host's active UI locale. */
export type SpindleHostLocale = "en" | "zh" | "zh-TW" | "ja" | "fr" | "it";

/** Synchronous host locale lookup with a removable live-change subscription. */
export interface SpindleHostLocaleAPI {
  get(): SpindleHostLocale;
  subscribe(listener: (locale: SpindleHostLocale) => void): () => void;
}
