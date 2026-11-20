import type { CharacterDTO, SpindleAPI, WorkerToHost } from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;

const defaults: Promise<{ data: CharacterDTO[]; total: number }> = spindle.characters.list();
const all = spindle.characters.list({ includeSystem: true, search: "Rooms", limit: 20, offset: 1, userId: "alice" });
const filtered = spindle.characters.list({ includeSystem: false });
const wire: WorkerToHost = { type: "characters_list", requestId: "request", includeSystem: true };
const flag: boolean | undefined = wire.includeSystem;

// @ts-expect-error includeSystem only accepts a boolean.
spindle.characters.list({ includeSystem: "true" });
// @ts-expect-error The wire contract also requires a boolean.
const invalid: WorkerToHost = { type: "characters_list", requestId: "request", includeSystem: 1 };

void [defaults, all, filtered, wire, flag, invalid];
