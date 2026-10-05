import { SPINDLE_STT_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type {
  SpindleFrontendContext, SpindleSTTAPI, SpindleSTTProvider, SpindleSTTSession,
  SpindleSTTTranscript, SpindleSTTPcmAudio, SpindleSTTOptions,
} from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;
const provider: SpindleSTTProvider = "whistle";
const capability: number = SPINDLE_STT_HOST_CAPABILITIES["speech-to-text-v1"];
const audio: SpindleSTTPcmAudio = { samples: new Float32Array(16000), sampleRate: 16000 };
if (ctx.stt && ctx.host.capabilities["speech-to-text-v1"] >= capability) {
  const stt: SpindleSTTAPI = ctx.stt;
  const available: boolean = stt.listProviders().some((item) => item.id === provider && item.available);
  const options: SpindleSTTOptions = { provider, signal: new AbortController().signal };
  void stt.prepare(options);
  const session: SpindleSTTSession = stt.start({ ...options, continuous: false,
    onResult(result) { const final: boolean = result.isFinal; const text: string = result.text; void [final, text]; },
    onAudioFrame(frame) { const peaks: number[] = frame.frequencies; void peaks; },
    onStatus(status) { const phase: "loading" | "listening" | "processing" = status.phase; void phase; },
  });
  const ready: Promise<void> = session.ready;
  const result: Promise<SpindleSTTTranscript> = session.result;
  const stopped: Promise<SpindleSTTTranscript> = session.stop();
  session.cancel();
  void stt.transcribe(audio, options);
  void stt.transcribe(new Blob(), { provider: "connection", connectionId: "profile" });
  void [available, ready, result, stopped];
  // @ts-expect-error Unknown providers cannot be silently mapped to an STT connection.
  stt.start({ provider: "whisper-local" });
  // @ts-expect-error PCM requires its original sample rate.
  stt.transcribe({ samples: new Float32Array() });
}
// Optional on legacy hosts and old mocks.
const legacy: Pick<SpindleFrontendContext, "stt"> = {};
void legacy;
