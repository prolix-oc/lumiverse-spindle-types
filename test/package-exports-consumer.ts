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
const descriptor: ProviderDescriptor = {
  kind,
  id: "emb-1",
  description: { dims: 768 },
  generation: 1,
};
const registerMsg: WorkerToHostProviderMessage = {
  type: "provider_register",
  phase: "register",
  kind: descriptor.kind,
  id: descriptor.id,
  description: descriptor.description,
  generation: descriptor.generation,
};
const unregisterMsg: WorkerToHostProviderMessage = {
  type: "provider_unregister",
  phase: "unregister",
  kind: descriptor.kind,
  id: descriptor.id,
};
const resultMsg: WorkerToHostProviderMessage = {
  type: "provider_result",
  phase: "result",
  correlationId: "c1",
  round: 1,
  result: { ok: true },
};
const invokeMsg: HostToWorkerProviderMessage = {
  type: "provider_invoke",
  phase: "invoke",
  correlationId: "c1",
  round: 1,
  key: { effectiveScope: "user:alice", installationId: "inst-a", kind: descriptor.kind, id: descriptor.id },
  request: { text: "hi" },
};
const abortMsg: HostToWorkerProviderMessage = {
  type: "provider_abort",
  phase: "abort",
  correlationId: "c1",
  round: 1,
  reason: "cancel",
};
const changedMsg: HostToWorkerProviderMessage = {
  type: "provider_changed",
  phase: "changed",
  action: "registered",
  key: { effectiveScope: "user:alice", installationId: "inst-a", kind: descriptor.kind, id: descriptor.id },
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
providers.register(descriptor);
providers.unregister(descriptor.kind, descriptor.id);
const disposeHandler: () => void = providers.handle(descriptor.kind, descriptor.id, (req) => {
  void req.correlationId;
  void req.round;
  void req.key.installationId;
  void req.request;
  void req.signal.aborted;
  return { ok: true };
});
const disposeChanged: () => void = providers.onChanged((event) => {
  void event.action;
  void event.key.installationId;
});
disposeHandler();
disposeChanged();

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
