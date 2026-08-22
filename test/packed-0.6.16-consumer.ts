import type {
  BrokerRequest,
  BrokerResponse,
  ProviderManager,
  ProviderRuntimeMessage,
  SpindleComponentsHelper,
  SpindleFrontendContextV2,
  SpindleHostSurfaceHandle,
  SpindleMountPoint,
  SpindlePermission,
} from "lumiverse-spindle-types";
import {
  ALL_PERMISSIONS,
  CoreEventType,
  SPINDLE_HOST_CAPABILITIES,
} from "lumiverse-spindle-types";

const v2Mounts: readonly SpindleMountPoint[] = [
  "chat_header_left",
  "lorebook_workspace",
  "prompt_variables_toolbar",
  "sidebar",
  "chat_toolbar",
  "message_footer",
  "settings_extensions",
];

const v2Permissions: readonly SpindlePermission[] = [
  "providers.embedding.register",
  "providers.tts.register",
  "providers.stt.register",
  "providers.sidecar.register",
];

declare const ctx: SpindleFrontendContextV2;
declare const components: SpindleComponentsHelper;
const surface: SpindleHostSurfaceHandle = components.mountHostSurface(
  document.body,
  "inspector",
  { open: true },
);
surface.update({ open: false });
surface.on("close", () => undefined);
surface.destroy();

void ctx.settings.get("theme");
void ctx.settings.core.list();
void ctx.ui.registerSettingsTab({ id: "ext", title: "Ext" });
void ctx.ui.geometry.toLayoutPx(16);
void ctx.host.surfaces.list();
void ctx.worldBooks.getGlobal();
void ctx.tokens.countChat("chat-1");
void ctx.connections.setActiveAcknowledged("conn-1");
void ctx.chats.getActive();
void ctx.messages.get("msg-1");
void ctx.registerComponentOverride({ componentId: "composer" });
void ctx.registerDomDecorator({ target: ".bubble", decorate: () => undefined });
void ctx.registerMessageAction({ id: "copy", label: "Copy", onClick: () => undefined });
void ctx.onTeardown(() => undefined);
void ctx.state.subscribe("activeChatId", () => undefined);

const request: BrokerRequest = {
  kind: "sidecar",
  id: "1",
  method: "GET",
  url: "https://sidecar.local",
  headers: {},
  body: "",
  bodyEncoding: "utf8",
  expectedResponseEncoding: "base64",
  timeoutMs: 30000,
  allowlistKey: "sidecar",
  correlationId: "c1",
  round: 1,
};
const response: BrokerResponse = {
  status: 204,
  headers: {},
  body: "",
  bodyEncoding: "utf8",
  contentType: "",
  ok: true,
  correlationId: "c1",
  round: 1,
};
declare const manager: ProviderManager;
manager.register({ kind: "sidecar", id: "1" });
const runtime: ProviderRuntimeMessage = {
  type: "provider_result",
  phase: "result",
  correlationId: "c1",
  round: 1,
  result: response,
};
void request;
void runtime;
void v2Mounts;
void v2Permissions;
void ALL_PERMISSIONS.includes("providers.sidecar.register");
void SPINDLE_HOST_CAPABILITIES["frontend-extensibility-v2"];
void CoreEventType.PROVIDER_CHANGED;
