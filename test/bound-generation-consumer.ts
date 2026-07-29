import type {
  BoundAssembleRequestDTO,
  PromptBlockSnapshotDTO,
  BoundAssemblyFailureDTO,
  BoundAssemblyOutcomeDTO,
  BoundAssemblySuccessDTO,
  BoundPrefillAttachmentDTO,
  ConnectionDispatchDescriptorDTO,
  GenerationDispatchSourceDTO,
  GenerationResponseDTO,
  GenerationUsageDTO,
  LlmMessageDTO,
  QuietDispatchReceiptDTO,
  QuietTrackedRequestDTO,
  QuietTrackedResultDTO,
  SpindleAPI,
  SpindleConnectionsAPI,
  SpindleGenerateAPI,
  ToolDefinitionDTO,
} from "lumiverse-spindle-types";

const mainDispatch: GenerationDispatchSourceDTO = {
  source: "main",
  expectedConnectionDispatchRevision: "main-revision",
};

const slotDispatch: GenerationDispatchSourceDTO = {
  source: "slot",
  connectionId: "connection-id",
  expectedConnectionDispatchRevision: "slot-revision",
};

const messages: LlmMessageDTO[] = [
  {
    role: "assistant",
    content: [
      {
        type: "tool_use",
        id: "call-1",
        name: "lookup",
        input: { query: "safe" },
        thought_signature: "provider-signature",
      },
    ],
    cache_control: { ttl: "request" },
    reasoning_content: "reasoning carrier",
    thinking_blocks: [
      { type: "thinking", thinking: "private provider reasoning", signature: "opaque" },
    ],
    reasoning_details: [{ type: "summary_text", text: "provider detail" }],
  },
];

const boundPromptSnapshot: PromptBlockSnapshotDTO = {
  id: "bound-block",
  name: "Bound dialogue",
  content: "{{dialogue}}",
  role: "system",
  enabled: true,
  position: "pre_history",
  depth: 0,
  marker: null,
  isLocked: false,
  color: null,
  injectionTrigger: [],
  group: null,
  placementBinding: {
    variableId: "layout",
    options: {
      standard: {
        role: "assistant_append",
        position: "in_history",
        depth: 2,
      },
    },
  },
  sealed: true,
  sealedKey: "dialogue.frame",
  sealedSource: "lumihub",
  sealedOriginPresetId: "lumihub-preset",
  sealedOriginVersion: "v3",
  sealedSha256: "sha256:dialogue-frame",
};
const promptBlocks: BoundAssembleRequestDTO["blocks"] = [boundPromptSnapshot];
const boundRequest: BoundAssembleRequestDTO = {
  blocks: promptBlocks,
  promptVariableValues: {},
  dispatch: mainDispatch,
  deadlineAt: Date.now() + 1_000,
  hookFailureMode: "degrade",
  macroFailureMode: "reject",
};

const boundSuccess: BoundAssemblySuccessDTO = {
  messages,
  breakdown: [],
  resolved: {
    source: "main",
    connectionId: null,
    connectionDispatchRevision: "main-revision",
    dispatchKind: "concrete",
  },
};

const boundFailures: BoundAssemblyFailureDTO[] = [
  {
    kind: "hook",
    code: "ASSEMBLY_HOOK_FAILED",
    phase: "context",
    reason: "timeout",
    message: "context hook timed out",
  },
  {
    kind: "macro",
    code: "ASSEMBLY_MACRO_FAILED",
    reason: "evaluation",
    message: "macro failed",
  },
  {
    kind: "retrieval_snapshot",
    code: "ASSEMBLY_RETRIEVAL_SNAPSHOT_UNAVAILABLE",
    reason: "missing",
    message: "snapshot unavailable",
  },
  { kind: "abort", code: "ASSEMBLY_ABORTED", name: "AbortError", message: "aborted" },
  { kind: "precondition", code: "ASSEMBLY_PRECONDITION_FAILED", message: "stale dispatch" },
  { kind: "security", code: "ASSEMBLY_SECURITY_FAILED", message: "invalid source" },
  { kind: "internal", code: "ASSEMBLY_INTERNAL_FAILED", message: "host error" },
];

const boundOutcomes: BoundAssemblyOutcomeDTO[] = [
  { ok: true, result: boundSuccess },
  ...boundFailures.map((error) => ({ ok: false as const, error })),
];

function inspectBoundOutcome(outcome: BoundAssemblyOutcomeDTO): string {
  if (outcome.ok) {
    return outcome.result.resolved.connectionDispatchRevision;
  }
  switch (outcome.error.kind) {
    case "hook":
      return outcome.error.phase;
    case "macro":
      return outcome.error.reason;
    case "retrieval_snapshot":
      return outcome.error.reason;
    case "abort":
      return outcome.error.name;
    case "precondition":
    case "security":
    case "internal":
      return outcome.error.code;
  }
}

const tool: ToolDefinitionDTO = {
  name: "lookup",
  description: "Look up a safe value",
  parameters: { type: "object", properties: {} },
  strict: true,
  inputExamples: [{ query: "safe" }],
  cache_control: { ttl: "request" },
};

const continuation: BoundPrefillAttachmentDTO = {
  id: "parent-attestation",
  state: "available",
};

const quietRequest: QuietTrackedRequestDTO = {
  messages,
  dispatch: slotDispatch,
  continuation: {
    parentPrefill: continuation,
    mode: "append-parent-carrier-last",
  },
  parameters: { temperature: 0.2 },
  reasoning: { effort: "low" },
  tools: [tool],
  deadlineAt: Date.now() + 1_000,
};

const usage: GenerationUsageDTO = {
  prompt_tokens: 10,
  completion_tokens: 5,
  total_tokens: 15,
  provider_raw: { cached: 2 },
};

const response: GenerationResponseDTO = {
  content: "safe response",
  reasoning: "safe reasoning carrier",
  finish_reason: "stop",
  tool_calls: [
    { name: "lookup", args: { query: "safe" }, call_id: "call-1", thought_signature: "opaque" },
  ],
  thinking_blocks: [{ type: "redacted_thinking", data: "opaque" }],
  reasoning_details: [{ type: "summary_text", text: "provider detail" }],
  usage,
};

const receipt: QuietDispatchReceiptDTO = {
  providerInvoked: true,
  terminalResponse: true,
  source: "slot",
  connectionId: "connection-id",
  connectionDispatchRevision: "slot-revision",
  usage,
};

const quietResults: QuietTrackedResultDTO[] = [
  { ok: true, response, receipt },
  {
    ok: false,
    phase: "preflight",
    providerInvoked: false,
    receipt: null,
    error: { kind: "precondition", code: "BOUND_INVOCATION_REQUIRED", name: "PreconditionError", message: "not bound" },
  },
  {
    ok: false,
    phase: "resolved",
    receipt,
    error: { kind: "provider", code: "PROVIDER_ACCESS_FAILED", name: "ProviderError", message: "provider unavailable" },
  },
];

function inspectQuietResult(result: QuietTrackedResultDTO): string {
  if (result.ok) return result.response.finish_reason;
  if (result.phase === "preflight") return result.error.kind;
  return `${result.error.kind}:${result.receipt.connectionDispatchRevision}`;
}

const descriptor: ConnectionDispatchDescriptorDTO = {
  connectionId: "connection-id",
  connectionName: "Safe connection",
  provider: "provider",
  model: "model",
  endpointOrigin: "https://provider.example",
  dispatchKind: "concrete",
  connectionDispatchRevision: "slot-revision",
};

const generateApi = {
  assemble: async () => ({ ok: true as const, result: boundSuccess }),
  quietTracked: async () => ({ ok: true as const, response, receipt }),
} satisfies Pick<SpindleGenerateAPI, "assemble" | "quietTracked">;

const connectionsApi: SpindleConnectionsAPI = {
  resolveDispatch: async () => descriptor,
};

declare const spindle: SpindleAPI;
const generateSurface: SpindleGenerateAPI = spindle.generate;
const connectionsSurface: SpindleConnectionsAPI = spindle.connections;

// These accesses intentionally fail if private runtime protocol material leaks
// into the public DTOs.
// @ts-expect-error invocation tokens are host-private
void ({} as BoundAssembleRequestDTO).invocationToken;
// @ts-expect-error snapshots are host-private
void ({} as QuietTrackedRequestDTO).parentGenerationSnapshot;
// @ts-expect-error leases are host-private
void ({} as QuietDispatchReceiptDTO).terminalFinalizationLease;
// @ts-expect-error API keys are not safe dispatch descriptor fields
void ({} as ConnectionDispatchDescriptorDTO).apiKey;
const invalidMainDispatch: GenerationDispatchSourceDTO = {
  source: "main",
  expectedConnectionDispatchRevision: "revision",
  // @ts-expect-error a main source cannot carry an explicit slot id
  connectionId: "must-not-be-public-on-main",
};
// @ts-expect-error attachment attestations are immutable
continuation.id = "mutated";

void inspectBoundOutcome;
void inspectQuietResult;
void generateApi;
void connectionsApi;
void generateSurface;
void connectionsSurface;
void boundRequest;
void quietRequest;
void boundOutcomes;
void quietResults;
