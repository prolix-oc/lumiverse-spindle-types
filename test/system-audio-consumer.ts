import { SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type {
  SpindleFrontendContext, SpindleSystemAudioAPI, SpindleSystemAudioAvailability, SpindleSystemAudioEndReason,
  SpindleSystemAudioFrame, SpindleSystemAudioSession,
  SpindleSystemAudioChannelFrame,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;
const capability: number = SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES["system-audio-v1"];
const stereoCapability: number = SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES["system-audio-stereo-v1"];
if (ctx.systemAudio && ctx.host.capabilities["system-audio-v1"] >= capability) {
  const audio: SpindleSystemAudioAPI = ctx.systemAudio;
  const availability: SpindleSystemAudioAvailability = audio.isAvailable();
  if (availability.available) {
    const session: SpindleSystemAudioSession = audio.start({
      bands: 32,
      maxFps: 30,
      stereo: availability.stereoSupported === true && ctx.host.capabilities["system-audio-stereo-v1"] >= stereoCapability,
      signal: new AbortController().signal,
      onFrame(frame: SpindleSystemAudioFrame) {
        const bars: number[] = frame.frequencies;
        const level: number = frame.amplitude + frame.peak;
        void [bars, level];
        if (frame.stereo) {
          const left: SpindleSystemAudioChannelFrame = frame.stereo.left;
          const right: SpindleSystemAudioChannelFrame = frame.stereo.right;
          const channels: number[] = [...left.frequencies, ...right.frequencies, left.amplitude, right.peak];
          void channels;
        }
      },
      onEnd(reason: SpindleSystemAudioEndReason) {
        const why: "revoked" | "user-stopped" | "source-lost" | "host-disabled" = reason;
        void why;
      },
    });
    const ready: Promise<void> = session.ready;
    session.stop();
    void ready;
  }
  const reason: "unsupported" | "disabled" | undefined = availability.unavailableReason;
  void reason;
  // @ts-expect-error A frame callback is required: a session with nothing listening is meaningless.
  audio.start({});
  // @ts-expect-error Raw audio is never exposed, so there is no sample or stream option.
  audio.start({ onFrame() {}, includeSamples: true });
  // @ts-expect-error Stereo is an opt-in boolean, not an arbitrary device format.
  audio.start({ onFrame() {}, stereo: "stereo" });
}
// Optional on legacy hosts and old mocks.
const legacy: Pick<SpindleFrontendContext, "systemAudio"> = {};
void legacy;
