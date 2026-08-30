import type {
  FinalResponseDTO,
  HostToWorker,
  InterceptorBreakdownEntryDTO,
  InterceptorResultDTO,
  PromptBlockOccurrenceDTO,
  PromptBlockMutationTargetDTO,
  PromptBlockCreateAuthorityDTO,
  SpindleAPI,
  SpindleFrontendContext,
  SpindleHostDescriptorV1,
  SpindleHostLocale,
  SpindleHostLocaleAPI,
  SpindleManifest,
  SpindlePermission,
  SpindleTabLocation,
  WorkerToHost,
} from "lumiverse-spindle-types";
import {
  ALL_PERMISSIONS,
  SPINDLE_COMPATIBILITY_ERROR_CODE,
  SPINDLE_HOST_CAPABILITIES,
  isValidPermission,
} from "lumiverse-spindle-types";

const host: SpindleHostDescriptorV1 = {
  descriptorVersion: 1,
  lumiverseVersion: "1.2.3",
  capabilities: SPINDLE_HOST_CAPABILITIES,
  extensionInstallationId: "550e8400-e29b-41d4-a716-446655440000",
};

const localeApi: SpindleHostLocaleAPI = {
  get: () => "en",
  subscribe: (listener) => {
    listener("fr");
    return () => undefined;
  },
};

const locale: SpindleHostLocale = localeApi.get();
const permission: SpindlePermission = "final_response";
const allPermissions: readonly SpindlePermission[] = ALL_PERMISSIONS;
if (!isValidPermission(permission) || !allPermissions.includes(permission)) {
  throw new Error("final_response must be a valid public permission");
}

const finalResponse: FinalResponseDTO = {
  content: "An extension-authored final answer",
  reasoning: "The selected branch completed successfully.",
  fallbackMessageIndex: 0,
};
const breakdown: InterceptorBreakdownEntryDTO = { messageIndex: 0, name: "Additional context" };

const result: InterceptorResultDTO = {
  messages: [{ role: "system", content: "Additional context" }],
  breakdown: [breakdown],
  finalResponse,
};
const wireResult: WorkerToHost = {
  type: "intercept_result",
  requestId: "request-id",
  registrationId: "registration-id",
  messages: result.messages,
  breakdown: [breakdown],
  finalResponse,
};

const init: HostToWorker = {
  type: "init",
  manifest: {
    version: "1.0.0",
    name: "Legacy extension",
    identifier: "legacy_extension",
    author: "Extension author",
    github: "https://github.com/example/legacy-extension",
    homepage: "https://example.com/legacy-extension",
    permissions: [],
  },
  storagePath: "/extensions/legacy_extension",
  host,
};

// The compatibility field is intentionally optional for legacy manifests.
const legacyManifest: SpindleManifest = {
  version: "1.0.0",
  name: "Legacy extension",
  identifier: "legacy_extension",
  author: "Extension author",
  github: "https://github.com/example/legacy-extension",
  homepage: "https://example.com/legacy-extension",
  permissions: [],
};
// @ts-expect-error host descriptor is required on the public init message
const legacyInitWithoutHost: HostToWorker = {
  type: "init",
  manifest: legacyManifest,
  storagePath: "/extensions/legacy_extension",
};
void locale;
void result;
void legacyManifest;

declare const spindle: SpindleAPI;
const versionedRegex = spindle.regex_scripts.create({
  name: "Versioned extension regex",
  find_regex: "example",
  folder: "Extension scripts",
  folder_version: "2.4.0",
});
versionedRegex.then((script) => {
  const folderVersion: string | null | undefined = script.folder_version;
  void folderVersion;
});
const backendHost: SpindleHostDescriptorV1 = spindle.host;
// @ts-expect-error the host descriptor is exposed as a readonly API property
spindle.host = host;
// @ts-expect-error nested capability records are readonly
spindle.host.capabilities["interceptor-final-response-v1"] = 2;
// @ts-expect-error descriptor scalar fields are readonly
spindle.host.lumiverseVersion = "2.0.0";
void backendHost;
const editorRequestId = "550e8400-e29b-41d4-a716-446655440001";
const editorResult = spindle.textEditor.open({ editorRequestId, value: "Review me" });
const editorClose = spindle.textEditor.close(editorRequestId);
const editorOpenMessage: WorkerToHost = {
  type: "text_editor_open",
  requestId: "transport-open",
  editorRequestId,
  value: "Review me",
};
const editorCloseMessage: WorkerToHost = {
  type: "text_editor_close",
  requestId: "transport-close",
  editorRequestId,
};
const skippedThumbnailUpload = spindle.images.upload({
  data: new Uint8Array([1, 2, 3]),
  filename: "card.avif",
  mime_type: "image/avif",
  skip_thumbnail_processing: true,
});
const skippedThumbnailDataUrlUpload = spindle.images.uploadFromDataUrl(
  "data:image/avif;base64,AQID",
  { skip_thumbnail_processing: true },
);
const skippedThumbnailDataUrlMessage: WorkerToHost = {
  type: "images_upload_from_data_url",
  requestId: "transport-image-upload",
  dataUrl: "data:image/avif;base64,AQID",
  skip_thumbnail_processing: true,
};
const blockOccurrence: PromptBlockOccurrenceDTO = {
  blockId: "duplicate-block",
  promptOrder: 3,
};
const blockTarget: PromptBlockMutationTargetDTO = {
  ...blockOccurrence,
  expectedCacheRevision: 11,
};
const blockCreateAuthority: PromptBlockCreateAuthorityDTO = {
  expectedCacheRevision: 11,
  index: 4,
};
const blockGetMessage: WorkerToHost = {
  type: "preset_blocks_get",
  requestId: "transport-block-get",
  presetId: "preset-1",
  occurrence: blockOccurrence,
  userId: "user-1",
};
const blockCreateMessage: WorkerToHost = {
  type: "preset_blocks_create",
  requestId: "transport-block-create",
  presetId: "preset-1",
  input: { name: "New block" },
  options: blockCreateAuthority,
  userId: "user-1",
};
const blockUpdateMessage: WorkerToHost = {
  type: "preset_blocks_update",
  requestId: "transport-block-update",
  presetId: "preset-1",
  target: blockTarget,
  input: { name: "Updated block" },
  userId: "user-1",
};
const blockDeleteMessage: WorkerToHost = {
  type: "preset_blocks_delete",
  requestId: "transport-block-delete",
  presetId: "preset-1",
  target: blockTarget,
  userId: "user-1",
};
// @ts-expect-error Prompt-block occurrences are immutable coordinates.
blockOccurrence.promptOrder = 4;
// @ts-expect-error Mutation revision authority is immutable.
blockTarget.expectedCacheRevision = 12;
const legacyBlockGetMessage: WorkerToHost = {
  type: "preset_blocks_get",
  requestId: "legacy-block-get",
  presetId: "preset-1",
  // @ts-expect-error A bare blockId is not an occurrence coordinate.
  blockId: "duplicate-block",
};
// @ts-expect-error Create wire messages require nested revision authority.
const createWithoutAuthorityMessage: WorkerToHost = {
  type: "preset_blocks_create",
  requestId: "legacy-block-create-no-cas",
  presetId: "preset-1",
  input: { name: "No CAS" },
};
const createWithLegacyIndexMessage: WorkerToHost = {
  type: "preset_blocks_create",
  requestId: "legacy-block-create-index",
  presetId: "preset-1",
  input: { name: "Legacy index" },
  options: blockCreateAuthority,
  // @ts-expect-error The insertion index is nested inside options.
  index: 4,
};
const createWithIndexOnlyMessage: WorkerToHost = {
  type: "preset_blocks_create",
  requestId: "legacy-block-create-index-only",
  presetId: "preset-1",
  input: { name: "Index without CAS" },
  // @ts-expect-error Create options must include expectedCacheRevision.
  options: { index: 4 },
};
const legacyBlockUpdateMessage: WorkerToHost = {
  type: "preset_blocks_update",
  requestId: "legacy-block-update",
  presetId: "preset-1",
  // @ts-expect-error Update requires an occurrence-scoped CAS target.
  blockId: "duplicate-block",
  input: { name: "Legacy update" },
};
const legacyBlockDeleteMessage: WorkerToHost = {
  type: "preset_blocks_delete",
  requestId: "legacy-block-delete",
  presetId: "preset-1",
  // @ts-expect-error Delete requires an occurrence-scoped CAS target.
  blockId: "duplicate-block",
};
void blockGetMessage;
void blockCreateMessage;
void blockUpdateMessage;
void blockDeleteMessage;
void legacyBlockGetMessage;
void createWithoutAuthorityMessage;
void createWithLegacyIndexMessage;
void createWithIndexOnlyMessage;
void legacyBlockUpdateMessage;
void legacyBlockDeleteMessage;
void editorResult;
void editorClose;
void editorOpenMessage;
void editorCloseMessage;
void skippedThumbnailUpload;
void skippedThumbnailDataUrlUpload;
void skippedThumbnailDataUrlMessage;

declare const ctx: SpindleFrontendContext;
const frontendHost: SpindleHostDescriptorV1 = ctx.host;
const activeLocale: SpindleHostLocale = ctx.locale.get();
const tabLocation: SpindleTabLocation = ctx.ui.getTabLocation("profile");
const unsubscribe = ctx.locale.subscribe((nextLocale) => {
  const checked: SpindleHostLocale = nextLocale;
  void checked;
});
// @ts-expect-error the frontend host descriptor is exposed as a readonly API property
ctx.host = host;
// @ts-expect-error the frontend locale API is exposed as a readonly API property
ctx.locale = localeApi;
void frontendHost;
void activeLocale;
void unsubscribe;
void tabLocation;
const compatibilityCode: "SPINDLE_COMPATIBILITY_ERROR" = SPINDLE_COMPATIBILITY_ERROR_CODE;
void compatibilityCode;

const asyncFrontendModule = {
  async setup(_ctx: SpindleFrontendContext) {
    return async () => undefined;
  },
  async teardown() {},
};
const typedAsyncFrontendModule: import("lumiverse-spindle-types").SpindleFrontendModule = asyncFrontendModule;
void typedAsyncFrontendModule;
