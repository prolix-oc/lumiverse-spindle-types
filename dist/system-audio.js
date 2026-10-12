/**
 * Host-managed analysis of the audio the device is playing, for frontend Spindle extensions.
 *
 * Extensions receive a spectrum and levels only (the same shape as `SpindleSTTAudioFrame`): never samples, a
 * `MediaStream`, or anything else from which what was played could be reconstructed. Available only where the host
 * has a native adapter (the desktop client); feature-detect `system-audio-v1` and call `isAvailable()`.
 */
export const SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES = Object.freeze({ 'system-audio-v1': 1, 'system-audio-stereo-v1': 1 });
