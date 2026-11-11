import { SPINDLE_FRONTEND_UUID_HOST_CAPABILITIES } from "lumiverse-spindle-types";
import type { SpindleAPI, SpindleFrontendContext, SpindleFrontendUUIDAPI } from "lumiverse-spindle-types";

declare const ctx: SpindleFrontendContext;
declare const spindle: SpindleAPI;

const legacy: Pick<SpindleFrontendContext, "uuid"> = {};
const capability: 1 = SPINDLE_FRONTEND_UUID_HOST_CAPABILITIES["frontend-uuid-v1"];
if (ctx.uuid && (ctx.host.capabilities["frontend-uuid-v1"] ?? 0) >= capability) {
  const uuid: SpindleFrontendUUIDAPI = ctx.uuid;
  const v4: string = uuid.v4();
  const v7: string = uuid.v7();
  const draft = { id: uuid.v4(), name: "Local draft" };
  // @ts-expect-error Frontend UUID generation is synchronous.
  const asynchronous: Promise<string> = uuid.v4();
  // @ts-expect-error Generation takes no user ID or options.
  uuid.v7("user");
  // @ts-expect-error The context UUID member is read-only.
  ctx.uuid = uuid;
  void [v4, v7, draft, asynchronous];
}

const backend: Promise<string> = spindle.uuid.v4();
// @ts-expect-error The backend contract remains asynchronous.
const synchronousBackend: string = spindle.uuid.v7();
void [legacy, backend, synchronousBackend];
