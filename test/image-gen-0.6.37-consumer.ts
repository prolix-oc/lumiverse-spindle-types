// Frozen native request/result contracts from 0.6.37. Keep these unchanged.
import type {
  ImageGenCharacterLoraSelectionDTO,
  ImageGenLoraEntryDTO,
  ImageGenNativeRequestDTO,
  ImageGenNativeResultDTO,
  ImageGenNativeParametersDTO,
  SpindleAPI,
  WorkerToHost,
} from "lumiverse-spindle-types";

interface LegacyNativeRequest {
  /** Chat used for prompt/macro context and native generation lifecycle. */
  chat_id: string;
  /** Inline prompt. Optional when native settings/preset supply one. */
  prompt?: string;
  negativePrompt?: string;
  promptMode?: "scene" | "custom" | "parsed_custom";
  promptPresetId?: string | null;
  /** Skip parser/scene rewriting and use the resolved prompt directly. */
  skipParse?: boolean;
  /** Defaults to true for extension-triggered native generation. */
  forceGeneration?: boolean;
  /** Omitted = native chat/default character-LoRA behavior. */
  characterLora?: ImageGenCharacterLoraSelectionDTO;
  /** Skip the user's active native LoRA preset for this request. */
  bypassActiveLoraPreset?: boolean;
  /** Ordered LoRA layers appended after preset + selected character layers. */
  extraLoras?: ImageGenLoraEntryDTO[];
  /** Additional positive anchor tags prepended after preset/character tags. */
  extraBaseTags?: string;
  /** Scale applied to the complete assembled LoRA stack. */
  loraStrengthScale?: number;
  /** Provider parameters merged over the active native connection defaults. */
  parameters?: Record<string, unknown>;
  /** Omit the base64 payload while retaining persisted IDs/URL. */
  includeDataUrl?: boolean;
  clientJobId?: string;
  promptGenerationTimeoutSeconds?: number;
  generationTimeoutSeconds?: number;
  /** For operator-scoped extensions. */
  userId?: string;
}

interface LegacyNativeResult {
  generated: boolean;
  reason?: string;
  prompt: string;
  negativePrompt?: string;
  provider: string;
  imageDataUrl?: string;
  imageId?: string;
  imageUrl?: string;
  jobId?: string;
}

type Assert<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

type RequestCompatibility = Assert<LegacyNativeRequest extends ImageGenNativeRequestDTO ? true : false>;
type ResultCompatibility = Assert<LegacyNativeResult extends ImageGenNativeResultDTO ? true : false>;
type ExistingRequestFields = Assert<Equal<Pick<ImageGenNativeRequestDTO, keyof LegacyNativeRequest>, LegacyNativeRequest>>;
type ExistingResultFields = Assert<Equal<Pick<ImageGenNativeResultDTO, keyof LegacyNativeResult>, LegacyNativeResult>>;
type OpenParameters = Assert<Equal<ImageGenNativeRequestDTO["parameters"], Record<string, unknown> | undefined>>;
type RequiredMethods = Assert<Equal<RequiredKeys<SpindleAPI["imageGen"]>,
  "generate" | "generateNative" | "generateStream" | "getProviders" | "listConnections" | "getConnection" | "getModels">>;
type ExistingWorkerUnion = Assert<Equal<Extract<WorkerToHost,
  { type: "image_gen_prompt_presets" | "image_gen_cancel_native" }>, never>>;

// Inline literals must retain the same freedom as Record<string, unknown> variables.
// These are compile-time compatibility examples, not recommended provider settings.
const legacyInput: ImageGenNativeRequestDTO = {
  chat_id: "chat",
  parameters: {
    workflow_id: null,
    workflowId: 42,
    comfyui_field_values: { node_fields: { "2:steps": { value: 24 } } },
    arbitrary_provider_value: [1, false, null],
  },
};
const legacyOpaqueInput: ImageGenNativeRequestDTO = {
  chat_id: "chat", parameters: { comfyui_field_values: "provider-specific-value" },
};

// Existing host implementations and mocks need not implement the new methods.
const legacyImageGen: SpindleAPI["imageGen"] = {
  async generate() { return { imageDataUrl: "", model: "test", provider: "test" }; },
  async generateNative(input: LegacyNativeRequest): Promise<LegacyNativeResult> {
    return { generated: false, prompt: input.prompt ?? "", provider: "test" };
  },
  async *generateStream() {},
  async getProviders() { return []; },
  async listConnections() { return []; },
  async getConnection() { return null; },
  async getModels() { return []; },
};

// Stricter controls remain available only when explicitly requested.
const checkedParameters = { workflow_id: "workflow", comfyui_field_values: {
  node_fields: { "2:steps": 24 },
} } satisfies ImageGenNativeParametersDTO;
// @ts-expect-error The opt-in helper still validates workflow IDs.
const invalidCheckedParameters = { workflow_id: null } satisfies ImageGenNativeParametersDTO;

void [legacyInput, legacyOpaqueInput, legacyImageGen, checkedParameters, invalidCheckedParameters];
