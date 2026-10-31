export const SPINDLE_HOST_CAPABILITIES = Object.freeze({
  "uuid-v1": 1,
  "message-preset-context-v1": 1,
  "chat-swipe-variables-v1": 1,
  "generation-message-sessions-v1": 1,
  "chat-conditional-metadata-v1": 1,
  "generation-request-messages-v1": 1,
  "chat-metadata-patch-v1": 1,
  "chat-lean-messages-v1": 1,
  "chat-swipe-reasoning-v1": 1,
  "preset-extension-data-v1": 1,
  "preset-editor-v1": 1,
  "loom-block-editor-v1": 1,
  "loom-block-management-v1": 1,
  "generation-assembly-v1": 1,
  "interceptor-context-v1": 1,
  "interceptor-final-response-v1": 1,
  "connection-dispatch-resolution-v1": 1,
  "text-editor-close-v1": 1,
  "frontend-extensibility-v2": 1,
  "frontend-runtime-capabilities-v1": 1,
  "command-session-routing-v1": 1,
  "mcp-servers-v1": 1,
  "decisions-v1": 1,
  "decision-images-v1": 1,
  "embeddings-v1": 1,
  "file-transfers-v1": 1,
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

/**
 * Version report for the running Lumiverse install, returned by
 * `spindle.version.getInfo()` (free tier — no permission needed).
 */
export interface LumiverseVersionInfo {
  /** Backend server semantic version (e.g. `"1.2.5"`). */
  readonly backend: string;
  /** Frontend bundle semantic version (e.g. `"1.2.5"`). */
  readonly frontend: string;
  /**
   * Commit the running build was made from (e.g. `"26939aa5"`), or `null`
   * when unavailable — Docker images, detached/non-git installs, and other
   * builds without git metadata report `null` rather than guessing.
   */
  readonly commit: string | null;
  /** Branch the running build was made from, or `null` when unavailable or HEAD is detached. */
  readonly branch: string | null;
}

/** Locale identifiers supplied by the host's active UI locale. */
export type SpindleHostLocale = "en" | "zh" | "zh-TW" | "ja" | "fr" | "it";

/** Synchronous host locale lookup with a removable live-change subscription. */
export interface SpindleHostLocaleAPI {
  get(): SpindleHostLocale;
  subscribe(listener: (locale: SpindleHostLocale) => void): () => void;
}
