/** Host-managed speech recognition for frontend Spindle extensions. */
export type SpindleSTTProvider = 'webspeech' | 'connection' | 'whistle';
export interface SpindleSTTProviderOption {
    id: SpindleSTTProvider;
    name: string;
    /** Whistle runs entirely on the device. Web Speech behavior depends on the browser. */
    onDevice: boolean;
    available: boolean;
    unavailableReason?: string;
    supportsAudioTranscription: boolean;
    languages?: readonly string[];
}
export interface SpindleSTTStatus {
    phase: 'loading' | 'listening' | 'processing';
    progress?: number;
}
/** One engine update: final segments append; interim updates replace the pending segment. */
export interface SpindleSTTResult {
    text: string;
    isFinal: boolean;
}
export interface SpindleSTTAudioFrame {
    amplitude: number;
    peak: number;
    frequencies: number[];
}
export interface SpindleSTTTranscript {
    text: string;
    provider: SpindleSTTProvider;
    language?: string;
}
/** Mono PCM for Whistle. Samples are copied; the caller's buffer is never detached. */
export interface SpindleSTTPcmAudio {
    samples: Float32Array;
    sampleRate: number;
}
export interface SpindleSTTOptions {
    /** Defaults to the user's current Voice & Speech selection. */
    provider?: SpindleSTTProvider;
    language?: string;
    /** Used only with the connection provider; defaults to the user's STT connection. */
    connectionId?: string;
    signal?: AbortSignal;
    onStatus?(status: SpindleSTTStatus): void;
}
export interface SpindleSTTStartOptions extends SpindleSTTOptions {
    /** Defaults to false: finish after confirmed speech followed by silence. */
    continuous?: boolean;
    /** Defaults to the user's interim-result preference. */
    interimResults?: boolean;
    onResult?(result: SpindleSTTResult): void;
    onAudioFrame?(frame: SpindleSTTAudioFrame): void;
}
export interface SpindleSTTSession {
    readonly provider: SpindleSTTProvider;
    /** Resolves when capture starts. Call start() directly from a user gesture. */
    readonly ready: Promise<void>;
    /** Resolves after recording ends and the final transcription finishes. */
    readonly result: Promise<SpindleSTTTranscript>;
    /** Stops capture and waits for the final transcript; safe to call repeatedly. */
    stop(): Promise<SpindleSTTTranscript>;
    /** Releases the microphone immediately; ready/result reject with AbortError if pending. */
    cancel(): void;
}
/** Host-managed frontend STT, available with speech-to-text-v1. No model installation needed. */
export interface SpindleSTTAPI {
    /** Capability discovery is free and never requests microphone access. */
    listProviders(): SpindleSTTProviderOption[];
    /** Requires media. Prepares Whistle without requesting microphone access. */
    prepare(options?: SpindleSTTOptions): Promise<void>;
    /** Requires media and browser microphone permission. One extension capture per document. */
    start(options?: SpindleSTTStartOptions): SpindleSTTSession;
    /**
     * Requires media. Whistle accepts a decodable audio Blob or mono PCM; connection accepts a Blob.
     * Web Speech cannot transcribe supplied audio. Whistle is capped at ten minutes / 64 MiB.
     */
    transcribe(audio: Blob | SpindleSTTPcmAudio, options?: SpindleSTTOptions): Promise<SpindleSTTTranscript>;
}
export declare const SPINDLE_STT_HOST_CAPABILITIES: Readonly<{
    'speech-to-text-v1': 1;
}>;
