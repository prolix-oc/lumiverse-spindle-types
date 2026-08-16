import type {
  BrokerRequest,
  BrokerResponse,
  HostToWorkerProviderMessage,
  ProviderDescriptor,
  ProviderKind,
  ProviderManager,
  ProviderRuntimeMessage,
  SpindleComponentOverrideHandle,
  SpindleComponentOverrideOptions,
  SpindleDomDecoratorHandle,
  SpindleDomDecoratorOptions,
  SpindleEmbeddingDriver,
  SpindleFrontendChatsAPI,
  SpindleFrontendConnectionsAPI,
  SpindleFrontendContextV2,
  SpindleFrontendMessagesAPI,
  SpindleFrontendTokensAPI,
  SpindleFrontendWorldBooksAPI,
  SpindleGeometryAPI,
  SpindleHostSurfaceAPI,
  SpindleHostSurfaceHandle,
  SpindleHostSurfaceInfo,
  SpindleMessageActionHandle,
  SpindleMessageActionOptions,
  SpindleResizeController,
  SpindleSettingsAPI,
  SpindleSettingsTabHandle,
  SpindleSettingsTabOptions,
  SpindleSidecarEndpoint,
  SpindleStateSelectors,
  SpindleSttEngine,
  SpindleTtsEngine,
  WorkerToHostProviderMessage,
} from "lumiverse-spindle-types";
import {
  ALL_PERMISSIONS,
  CoreEventType,
  SPINDLE_HOST_CAPABILITIES,
  isValidPermission,
} from "lumiverse-spindle-types";

const kind: ProviderKind = "embedding";
const descriptor: ProviderDescriptor = { id: "emb-1", kind, name: "Local embed" };
const registerMsg: WorkerToHostProviderMessage = {
  type: "provider_register",
  requestId: "r1",
  descriptor,
};
const unregisterMsg: WorkerToHostProviderMessage = {
  type: "provider_unregister",
  requestId: "r2",
  providerId: descriptor.id,
};
const resultMsg: WorkerToHostProviderMessage = {
  type: "provider_result",
  requestId: "r3",
  result: { ok: true },
};
const invokeMsg: HostToWorkerProviderMessage = {
  type: "provider_invoke",
  requestId: "r4",
  providerId: descriptor.id,
  method: "embed",
  timeoutMs: 30000,
};
const abortMsg: HostToWorkerProviderMessage = {
  type: "provider_abort",
  requestId: "r4",
};
const changedMsg: HostToWorkerProviderMessage = {
  type: "provider_changed",
  providerId: descriptor.id,
  change: "registered",
};
const runtime: ProviderRuntimeMessage[] = [
  registerMsg,
  unregisterMsg,
  resultMsg,
  invokeMsg,
  abortMsg,
  changedMsg,
];

const brokerRequest: BrokerRequest = {
  kind: "sidecar",
  id: "req-1",
  method: "POST",
  url: "https://sidecar.local/v1",
  headers: { accept: "application/json" },
  body: "{}",
  bodyEncoding: "utf8",
  expectedResponseEncoding: "utf8",
  timeoutMs: 30000,
  allowlistKey: "sidecar",
  correlationId: "corr-1",
  round: 0,
};
const brokerResponse: BrokerResponse = {
  status: 200,
  headers: { "content-type": "application/json" },
  body: "{}",
  bodyEncoding: "utf8",
  contentType: "application/json",
  ok: true,
  correlationId: "corr-1",
  round: 0,
};

declare const providers: ProviderManager;
void providers.register(descriptor);
void providers.list();
void providers.invoke(descriptor.id, "embed");
void providers.revoke(descriptor.id);
void providers.reconnect(descriptor.id);
void providers.disposeGeneration("gen-1");

const embedding: SpindleEmbeddingDriver = {
  id: "emb",
  embed: async () => ({ embeddings: [[0]] }),
};
const tts: SpindleTtsEngine = {
  id: "tts",
  synthesize: async () => ({ audio: new Uint8Array(), contentType: "audio/wav" }),
};
const stt: SpindleSttEngine = {
  id: "stt",
  transcribe: async () => ({ text: "" }),
};
const sidecar: SpindleSidecarEndpoint = {
  id: "side",
  path: "/v1",
  handle: async (request: BrokerRequest) => {
    void request;
    return brokerResponse;
  },
};

const settingsTab: SpindleSettingsTabOptions = { id: "tab", title: "Tab" };
declare const settings: SpindleSettingsAPI;
declare const tabHandle: SpindleSettingsTabHandle;
declare const geometry: SpindleGeometryAPI;
declare const resize: SpindleResizeController;
declare const surfaceApi: SpindleHostSurfaceAPI;
declare const surfaceInfo: SpindleHostSurfaceInfo;
declare const surfaceHandle: SpindleHostSurfaceHandle;
declare const overrideOptions: SpindleComponentOverrideOptions;
declare const overrideHandle: SpindleComponentOverrideHandle;
declare const decoratorOptions: SpindleDomDecoratorOptions;
declare const decoratorHandle: SpindleDomDecoratorHandle;
declare const actionOptions: SpindleMessageActionOptions;
declare const actionHandle: SpindleMessageActionHandle;
declare const state: SpindleStateSelectors;
declare const worldBooks: SpindleFrontendWorldBooksAPI;
declare const tokens: SpindleFrontendTokensAPI;
declare const connections: SpindleFrontendConnectionsAPI;
declare const chats: SpindleFrontendChatsAPI;
declare const messages: SpindleFrontendMessagesAPI;
declare const ctxV2: SpindleFrontendContextV2;

void settings.get("k");
void settings.core.isReady();
void tabHandle.destroy();
void geometry.getUiScale();
void resize.destroy();
void surfaceApi.list();
void surfaceInfo.id;
void surfaceHandle.update({});
void overrideOptions.componentId;
void overrideHandle.destroy();
void decoratorOptions.target;
void decoratorHandle.destroy();
void actionOptions.id;
void actionHandle.destroy();
void state.get("activeChatId");
void worldBooks.list();
void tokens.countText("hi");
void connections.setActiveAcknowledged(null);
void chats.getActive();
void messages.list();
void ctxV2.ui.geometry.layoutViewportSize();
void ctxV2.host.surfaces.invoke("surface", "ping");
void ctxV2.ui.registerSettingsTab;
void settingsTab.id;
void embedding;
void tts;
void stt;
void sidecar;
void brokerRequest;
void runtime;

const v2Capability = SPINDLE_HOST_CAPABILITIES["frontend-extensibility-v2"];
if (v2Capability !== 1) {
  throw new Error("frontend-extensibility-v2 must be advertised as 1");
}
const providerEvent: "PROVIDER_CHANGED" = CoreEventType.PROVIDER_CHANGED;
const providerPerms = [
  "providers.embedding.register",
  "providers.tts.register",
  "providers.stt.register",
  "providers.sidecar.register",
] as const;
for (const permission of providerPerms) {
  if (!isValidPermission(permission) || !ALL_PERMISSIONS.includes(permission)) {
    throw new Error(`missing provider permission: ${permission}`);
  }
}
void v2Capability;
void providerEvent;
