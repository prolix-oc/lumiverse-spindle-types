export declare const SPINDLE_HOST_CAPABILITIES: Readonly<Record<string, number>>;
/** Structured error code returned when host compatibility validation fails. */
export declare const SPINDLE_COMPATIBILITY_ERROR_CODE: "SPINDLE_COMPATIBILITY_ERROR";
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
