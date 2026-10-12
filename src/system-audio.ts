/**
 * Host-managed analysis of the audio the device is playing, for frontend Spindle extensions.
 *
 * Extensions receive a spectrum and levels only (the same shape as `SpindleSTTAudioFrame`): never samples, a
 * `MediaStream`, or anything else from which what was played could be reconstructed. Available only where the host
 * has a native adapter (the desktop client); feature-detect `system-audio-v1` and call `isAvailable()`.
 */

/** Why system audio cannot be started right now. */
export type SpindleSystemAudioUnavailableReason =
  /** This host or device has no system-audio adapter (every browser, and desktop platforms without one). */
  | 'unsupported'
  /** The user has not enabled system-audio analysis for this client. */
  | 'disabled'

export interface SpindleSystemAudioAvailability {
  available: boolean
  unavailableReason?: SpindleSystemAudioUnavailableReason
  /** The native adapter supports stereo analysis. Missing means an older or unsupported client. */
  stereoSupported?: boolean
}

/** One channel's analysis. Every number is normalised to 0 – 1. */
export interface SpindleSystemAudioChannelFrame {
  /** Overall level (RMS). */
  amplitude: number
  /** Loudest recent level. */
  peak: number
  /** `bands` log-spaced magnitudes from about 40 Hz up to about 14 kHz, lowest first. */
  frequencies: number[]
}

/** Combined analysis, with optional independent channels when stereo was requested. Never contains samples. */
export interface SpindleSystemAudioFrame extends SpindleSystemAudioChannelFrame {
  stereo?: { left: SpindleSystemAudioChannelFrame; right: SpindleSystemAudioChannelFrame }
}

/** Why a session ended without the extension calling `stop()`. */
export type SpindleSystemAudioEndReason = 'revoked' | 'user-stopped' | 'source-lost' | 'host-disabled'

export interface SpindleSystemAudioStartOptions {
  /** Number of bands in each frame, 8 – 64 (default 32). The host clamps out-of-range values. */
  bands?: number
  /** Most frames per second, 1 – 30 (default 30). The host clamps out-of-range values. */
  maxFps?: number
  /** Add independent left/right analysis. Default false. Requires stereoSupported; otherwise ready rejects with NotSupportedError. */
  stereo?: boolean
  signal?: AbortSignal
  onFrame(frame: SpindleSystemAudioFrame): void
  /** Called once if the host ends the session (permission revoked, the user pressed Stop on the host's indicator, the device went away). */
  onEnd?(reason: SpindleSystemAudioEndReason): void
}

export interface SpindleSystemAudioSession {
  /**
   * Resolves when the host has verified explicit or remembered approval and analysis has begun. Rejects with a `NotAllowedError`
   * `DOMException` if the user declines, `NotSupportedError` if unavailable, and `AbortError` if cancelled first.
   */
  readonly ready: Promise<void>
  /** Stops analysis immediately; safe to call repeatedly. */
  stop(): void
}

/** Host-managed system-audio analysis, available with `system-audio-v1`. */
export interface SpindleSystemAudioAPI {
  /** Free. Never prompts, and never opens anything. */
  isAvailable(): SpindleSystemAudioAvailability
  /**
   * Requires `system_audio`. Call the first start from a user gesture. The host checks explicit or remembered
   * approval and shows an indicator for as long as analysis runs. One session per extension at a time.
   */
  start(options: SpindleSystemAudioStartOptions): SpindleSystemAudioSession
}

export const SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES = Object.freeze({ 'system-audio-v1': 1, 'system-audio-stereo-v1': 1 })
