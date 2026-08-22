import type {
  HostToWorker,
  HostToWorkerProviderMessage,
  ProviderRuntimeMessage,
  WorkerToHost,
  WorkerToHostProviderMessage,
} from "lumiverse-spindle-types";

type Expect<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

// ─── Core canonical wire schema (verbatim from Lumiverse worker-runtime) ──
//
// Copied verbatim from `src/spindle/worker-runtime.ts`:
//   - `RuntimeWorkerToHost` provider members
//   - `RuntimeHostToWorker` provider members
// If Core changes, this block must be updated to match — the Expect<Equal<>>
// checks below will then force the public types to follow.

type CoreProviderBrokerSpec = {
  url: string;
  method?: string;
  secretKey?: string;
  headers?: Record<string, string>;
  kind?: "embedding" | "tts" | "stt" | "sidecar";
};

type CoreProviderKey = {
  effectiveScope: string;
  installationId: string;
  kind: string;
  id: string;
};

type CoreWorkerToHostProvider =
  | {
      type: "provider_register";
      phase: "register";
      kind: string;
      id: string;
      description?: unknown;
      broker?: CoreProviderBrokerSpec;
      generation?: number;
      revision?: number;
    }
  | { type: "provider_unregister"; phase: "unregister"; kind: string; id: string }
  | {
      type: "provider_result";
      phase: "result";
      correlationId: string;
      round?: number;
      result?: unknown;
      error?: string;
    };

type CoreHostToWorkerProvider =
  | {
      type: "provider_invoke";
      phase: "invoke";
      correlationId: string;
      round: number;
      key: CoreProviderKey;
      request: unknown;
    }
  | {
      type: "provider_abort";
      phase: "abort";
      correlationId: string;
      round: number;
      reason?: string;
    }
  | {
      type: "provider_changed";
      phase: "changed";
      action: "registered" | "unregistered" | "updated";
      key: CoreProviderKey;
    };

// ─── Directional exhaustiveness ──────────────────────────────────────────

type WorkerProviderType = Extract<WorkerToHost, { type: `provider_${string}` }>["type"];
type HostProviderType = Extract<HostToWorker, { type: `provider_${string}` }>["type"];
type RuntimeType = ProviderRuntimeMessage["type"];
type WorkerAliasType = WorkerToHostProviderMessage["type"];
type HostAliasType = HostToWorkerProviderMessage["type"];

type _workerExact = Expect<
  Equal<WorkerProviderType, "provider_register" | "provider_unregister" | "provider_result">
>;
type _hostExact = Expect<
  Equal<HostProviderType, "provider_invoke" | "provider_abort" | "provider_changed">
>;
type _aliasWorker = Expect<Equal<WorkerAliasType, WorkerProviderType>>;
type _aliasHost = Expect<Equal<HostAliasType, HostProviderType>>;
type _runtimeExact = Expect<
  Equal<
    RuntimeType,
    | "provider_register"
    | "provider_unregister"
    | "provider_result"
    | "provider_invoke"
    | "provider_abort"
    | "provider_changed"
  >
>;

// ─── Deep payload equality (both directions, per member) ─────────────────

type WorkerRegister = Extract<WorkerToHostProviderMessage, { type: "provider_register" }>;
type WorkerUnregister = Extract<WorkerToHostProviderMessage, { type: "provider_unregister" }>;
type WorkerResult = Extract<WorkerToHostProviderMessage, { type: "provider_result" }>;
type HostInvoke = Extract<HostToWorkerProviderMessage, { type: "provider_invoke" }>;
type HostAbort = Extract<HostToWorkerProviderMessage, { type: "provider_abort" }>;
type HostChanged = Extract<HostToWorkerProviderMessage, { type: "provider_changed" }>;

type CoreRegister = Extract<CoreWorkerToHostProvider, { type: "provider_register" }>;
type CoreUnregister = Extract<CoreWorkerToHostProvider, { type: "provider_unregister" }>;
type CoreResult = Extract<CoreWorkerToHostProvider, { type: "provider_result" }>;
type CoreInvoke = Extract<CoreHostToWorkerProvider, { type: "provider_invoke" }>;
type CoreAbort = Extract<CoreHostToWorkerProvider, { type: "provider_abort" }>;
type CoreChanged = Extract<CoreHostToWorkerProvider, { type: "provider_changed" }>;

type _deepRegister = Expect<Equal<WorkerRegister, CoreRegister>>;
type _deepRegisterReverse = Expect<Equal<CoreRegister, WorkerRegister>>;
type _deepUnregister = Expect<Equal<WorkerUnregister, CoreUnregister>>;
type _deepUnregisterReverse = Expect<Equal<CoreUnregister, WorkerUnregister>>;
type _deepResult = Expect<Equal<WorkerResult, CoreResult>>;
type _deepResultReverse = Expect<Equal<CoreResult, WorkerResult>>;
type _deepInvoke = Expect<Equal<HostInvoke, CoreInvoke>>;
type _deepInvokeReverse = Expect<Equal<CoreInvoke, HostInvoke>>;
type _deepAbort = Expect<Equal<HostAbort, CoreAbort>>;
type _deepAbortReverse = Expect<Equal<CoreAbort, HostAbort>>;
type _deepChanged = Expect<Equal<HostChanged, CoreChanged>>;
type _deepChangedReverse = Expect<Equal<CoreChanged, HostChanged>>;

// Whole-union equality in both directions catches added/removed members too.
type _deepWorkerUnion = Expect<Equal<WorkerToHostProviderMessage, CoreWorkerToHostProvider>>;
type _deepWorkerUnionReverse = Expect<Equal<CoreWorkerToHostProvider, WorkerToHostProviderMessage>>;
type _deepHostUnion = Expect<Equal<HostToWorkerProviderMessage, CoreHostToWorkerProvider>>;
type _deepHostUnionReverse = Expect<Equal<CoreHostToWorkerProvider, HostToWorkerProviderMessage>>;
type _deepRuntimeUnion = Expect<
  Equal<ProviderRuntimeMessage, CoreWorkerToHostProvider | CoreHostToWorkerProvider>
>;

// ─── Runtime deep-equality of canonical sample payloads ──────────────────

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return a === b;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const aKeys = Object.keys(a as Record<string, unknown>).sort();
  const bKeys = Object.keys(b as Record<string, unknown>).sort();
  if (aKeys.length !== bKeys.length || aKeys.some((key, index) => key !== bKeys[index])) {
    return false;
  }
  return aKeys.every((key) =>
    deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
  );
}

const canonicalWorkerSamples: Array<[WorkerToHostProviderMessage, CoreWorkerToHostProvider]> = [
  [
    {
      type: "provider_register",
      phase: "register",
      kind: "embedding",
      id: "foo",
      description: { dims: 768 },
      broker: { url: "https://broker.test", method: "POST", kind: "embedding" },
      generation: 2,
      revision: 5,
    },
    {
      type: "provider_register",
      phase: "register",
      kind: "embedding",
      id: "foo",
      description: { dims: 768 },
      broker: { url: "https://broker.test", method: "POST", kind: "embedding" },
      generation: 2,
      revision: 5,
    },
  ],
  [
    { type: "provider_unregister", phase: "unregister", kind: "embedding", id: "foo" },
    { type: "provider_unregister", phase: "unregister", kind: "embedding", id: "foo" },
  ],
  [
    {
      type: "provider_result",
      phase: "result",
      correlationId: "c1",
      round: 1,
      result: { ok: true },
    },
    {
      type: "provider_result",
      phase: "result",
      correlationId: "c1",
      round: 1,
      result: { ok: true },
    },
  ],
];

const canonicalHostSamples: Array<[HostToWorkerProviderMessage, CoreHostToWorkerProvider]> = [
  [
    {
      type: "provider_invoke",
      phase: "invoke",
      correlationId: "c1",
      round: 1,
      key: { effectiveScope: "user:alice", installationId: "inst-a", kind: "embedding", id: "foo" },
      request: { text: "hi" },
    },
    {
      type: "provider_invoke",
      phase: "invoke",
      correlationId: "c1",
      round: 1,
      key: { effectiveScope: "user:alice", installationId: "inst-a", kind: "embedding", id: "foo" },
      request: { text: "hi" },
    },
  ],
  [
    {
      type: "provider_abort",
      phase: "abort",
      correlationId: "c1",
      round: 1,
      reason: "cancel",
    },
    {
      type: "provider_abort",
      phase: "abort",
      correlationId: "c1",
      round: 1,
      reason: "cancel",
    },
  ],
  [
    {
      type: "provider_changed",
      phase: "changed",
      action: "registered",
      key: { effectiveScope: "user:alice", installationId: "inst-a", kind: "embedding", id: "foo" },
    },
    {
      type: "provider_changed",
      phase: "changed",
      action: "registered",
      key: { effectiveScope: "user:alice", installationId: "inst-a", kind: "embedding", id: "foo" },
    },
  ],
];

function assertDeepSamples(
  samples: Array<[unknown, unknown]>,
  label: string,
): void {
  for (const [ours, core] of samples) {
    if (!deepEqual(ours, core)) {
      throw new Error(`${label}: canonical payload diverges from Core wire schema`);
    }
  }
}

const caseName = "keeps provider runtime payloads deeply equal to core wire schema" as const;

export function keepsProviderRuntimePayloadsDeeplyEqualToCoreWireSchema(): typeof caseName {
  const _checks: [
    _workerExact,
    _hostExact,
    _aliasWorker,
    _aliasHost,
    _runtimeExact,
    _deepRegister,
    _deepRegisterReverse,
    _deepUnregister,
    _deepUnregisterReverse,
    _deepResult,
    _deepResultReverse,
    _deepInvoke,
    _deepInvokeReverse,
    _deepAbort,
    _deepAbortReverse,
    _deepChanged,
    _deepChangedReverse,
    _deepWorkerUnion,
    _deepWorkerUnionReverse,
    _deepHostUnion,
    _deepHostUnionReverse,
    _deepRuntimeUnion,
  ] = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  void _checks;
  assertDeepSamples(canonicalWorkerSamples, "worker→host");
  assertDeepSamples(canonicalHostSamples, "host→worker");
  return caseName;
}

keepsProviderRuntimePayloadsDeeplyEqualToCoreWireSchema();
