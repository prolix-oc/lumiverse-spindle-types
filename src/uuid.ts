/** Backend UUID generation (free tier — no permission needed). */
export interface SpindleUUIDAPI {
  /** Generate a random UUID v4 string using the backend's UUID helper. */
  v4(): Promise<string>;
  /** Generate a timestamp-ordered UUID v7 string using the backend's UUID helper. */
  v7(): Promise<string>;
}

/** Frontend-only capability; backend uuid-v1 does not imply this API exists. */
export const SPINDLE_FRONTEND_UUID_HOST_CAPABILITIES = Object.freeze({
  "frontend-uuid-v1": 1,
} as const);

/** Synchronous browser-local UUID generation (free tier; works over HTTP). */
export interface SpindleFrontendUUIDAPI {
  /** Generate a random UUID v4 using the frontend's secure-context-safe helper. */
  v4(): string;
  /** Generate UUID v7 using this frontend runtime's clock and shared helper counter. */
  v7(): string;
}

export type UUIDWorkerMessage = {
  type: "uuid_generate";
  requestId: string;
  version: 4 | 7;
};
