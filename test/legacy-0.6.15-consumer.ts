import type {
  HostToWorker,
  SpindleFrontendContext,
  SpindleMountPoint,
  SpindlePermission,
  WorkerToHost,
} from "lumiverse-spindle-types";
import {
  ALL_PERMISSIONS,
  isValidPermission,
} from "lumiverse-spindle-types";

const legacyMounts: readonly SpindleMountPoint[] = [
  "sidebar",
  "chat_toolbar",
  "message_footer",
  "settings_extensions",
];

const legacyPermissions: readonly SpindlePermission[] = [
  "generation",
  "interceptor",
  "tools",
  "cors_proxy",
  "context_handler",
  "ephemeral_storage",
  "chat_mutation",
  "event_tracking",
  "ui_panels",
  "app_manipulation",
  "oauth",
  "characters",
  "chats",
  "presets",
  "world_books",
  "regex_scripts",
  "databanks",
  "memories",
  "media",
  "personas",
  "push_notification",
  "image_gen",
  "images",
  "generation_parameters",
  "macro_interceptor",
  "web_search",
  "unsafe_eval",
  "final_response",
];

for (const permission of legacyPermissions) {
  if (!isValidPermission(permission) || !ALL_PERMISSIONS.includes(permission)) {
    throw new Error(`0.6.15 permission missing: ${permission}`);
  }
}

declare const ctx: SpindleFrontendContext;
const mount: SpindleMountPoint = legacyMounts[0];
ctx.ui.mount(mount);
ctx.ready();
ctx.deferReady();
ctx.sendToBackend({ type: "ping" });
void ctx.getActiveChat();
void ctx.messages.listMessageIds();
void ctx.chats.updateMessage("chat", "msg", { content: "ok" });
void ctx.host.descriptorVersion;
void ctx.locale.get();
void ctx.components.mountTextInput;

const worker: WorkerToHost = { type: "subscribe_event", event: "CHAT_CHANGED" };
const host: HostToWorker = { type: "shutdown" };
void worker;
void host;
void legacyMounts;
void legacyPermissions;
