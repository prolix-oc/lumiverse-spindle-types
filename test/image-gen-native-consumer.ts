import type {
  ImageGenComfyUIFieldValuesDTO,
  ImageGenNativeParametersDTO,
  ImageGenNativeControlWorkerMessage,
  ImageGenNativeRequestDTO,
  ImageGenNativeResultDTO,
  ImageGenPromptPresetDTO,
  ImageGenPromptPresetsResultDTO,
  SpindleAPI,
  WorkerToHost,
} from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;

const fields: ImageGenComfyUIFieldValuesDTO = {
  custom: { "7:length": 81 },
  node_fields: { "2:steps": 24, "3:steps": 8, "2:seed": -1, "4:enabled": true },
};
const parameters: ImageGenNativeParametersDTO = {
  workflow_id: "video-workflow",
  comfyui_field_values: fields,
  provider_specific_option: { enabled: true },
};
const input: ImageGenNativeRequestDTO = {
  chat_id: "chat",
  connection_id: "comfy-connection",
  source_image_id: "source-image",
  output_media_type: "video",
  output_node_id: "9",
  promptPresetId: "main-preset",
  parameters,
  clientJobId: "quickgen-job",
  includeDataUrl: false,
};

async function consumeNative(): Promise<void> {
  if (!spindle.imageGen.getPromptPresets || !spindle.imageGen.cancelNative) return;
  const catalog: ImageGenPromptPresetsResultDTO = await spindle.imageGen.getPromptPresets("user");
  const activeId: string | null = catalog.activeId;
  const activeConnection: string | null = catalog.activeConnectionId;
  const preset: ImageGenPromptPresetDTO | undefined = catalog.presets[0];
  const result: ImageGenNativeResultDTO = await spindle.imageGen.generateNative(input);
  const kind: "image" | "video" | undefined = result.mediaType;
  const mime: string | undefined = result.mimeType;
  const mediaUrl: string | undefined = result.mediaUrl;
  const cancelled: boolean = await spindle.imageGen.cancelNative("quickgen-job", "user");
  // Legacy requests and provider-specific parameter dictionaries remain valid.
  const legacyParameters: Record<string, unknown> = { steps: 20 };
  await spindle.imageGen.generateNative({ chat_id: "chat", parameters: legacyParameters });
  void [activeId, activeConnection, preset, kind, mime, mediaUrl, cancelled];
}

const discover: ImageGenNativeControlWorkerMessage = { type: "image_gen_prompt_presets", requestId: "discover", userId: "user" };
const cancel: ImageGenNativeControlWorkerMessage = { type: "image_gen_cancel_native", requestId: "cancel", jobId: "quickgen-job" };
const generate: WorkerToHost = { type: "image_gen_generate_native", requestId: "generate", input };
// Legacy results need not contain the new media fields.
const legacyResult: ImageGenNativeResultDTO = { generated: false, prompt: "", provider: "comfyui" };
// Legacy presets without a kind remain valid.
const legacyPreset: ImageGenPromptPresetDTO = { id: "main", name: "Main", mode: "custom", prompt: "landscape" };

// @ts-expect-error Only image/video are supported output media kinds.
const badMedia: ImageGenNativeRequestDTO = { chat_id: "chat", output_media_type: "audio" };
// @ts-expect-error Mapped node overrides must be primitive values.
const badFields: ImageGenComfyUIFieldValuesDTO = { node_fields: { "2:steps": { value: 24 } } };
// @ts-expect-error Native cancellation needs a job ID.
const badCancel: ImageGenNativeControlWorkerMessage = { type: "image_gen_cancel_native", requestId: "cancel" };

void [consumeNative, discover, cancel, generate, legacyResult, legacyPreset, badMedia, badFields, badCancel];
