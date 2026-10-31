import type { SpindleAPI, SpindleUUIDAPI, UUIDWorkerMessage, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;
const uuid: SpindleUUIDAPI = spindle.uuid;
const v4: Promise<string> = uuid.v4();
const v7: string = await uuid.v7();
const message: UUIDWorkerMessage = { type: "uuid_generate", requestId: "uuid", version: 7 };
const workerMessage: WorkerToHost = message;
const v4Message: WorkerToHost = { type: "uuid_generate", requestId: "uuid-v4", version: 4 };

// @ts-expect-error Only UUID versions 4 and 7 are supported.
const invalid: UUIDWorkerMessage = { type: "uuid_generate", requestId: "uuid", version: 1 };
// @ts-expect-error The requested UUID version is required on the wire.
const missing: UUIDWorkerMessage = { type: "uuid_generate", requestId: "uuid" };
// @ts-expect-error UUID generation is asynchronous.
const synchronous: string = uuid.v4();
// @ts-expect-error Generation takes no options or user ID.
uuid.v7("user");

void [v4, v7, workerMessage, v4Message, invalid, missing, synchronous];
