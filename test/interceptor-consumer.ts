import type {
  BoundAssembleRequestDTO,
  BoundPrefillAttachmentDTO,
  ConnectionDispatchDescriptorDTO,
  DeferredGuidanceDTO,
  HostToWorker,
  InterceptorContextDTO,
  InterceptorGenerationType,
  InterceptorHandler,
  InterceptorMatchDTO,
  InterceptorRegistrationMatchOptions,
  InterceptorRegistrationOptions,
  InterceptorResultDTO,
  InterceptorDisposer,
  InterceptorBreakdownEntryDTO,
  LlmMessageDTO,
  QuietTrackedRequestDTO,
  SpindleAPI,
  WorkerToHost,
} from "lumiverse-spindle-types";

const generationType: InterceptorGenerationType = "continue";
const match: InterceptorMatchDTO = {
  generationTypes: ["normal", generationType],
  isDryRun: false,
  presetField: {
    path: ["activeMode"],
    exists: true,
    notIn: ["single", 0, false, null],
    oneOf: ["sequential", "parallel"],
  },
};
const matchOptions: InterceptorRegistrationMatchOptions = { match };
const options: InterceptorRegistrationOptions = { priority: 900, match };

const descriptor: ConnectionDispatchDescriptorDTO = {
  connectionId: "connection-id",
  connectionName: "Main",
  provider: "provider",
  model: "model",
  endpointOrigin: "https://provider.example",
  dispatchKind: "concrete",
  connectionDispatchRevision: "revision-1",
};
const prefillCarrier: BoundPrefillAttachmentDTO = {
  id: "prefill-attestation",
  state: "available",
};
const context: InterceptorContextDTO = {
  userId: "user-id",
  chatId: "chat-id",
  generationId: "generation-id",
  generationType,
  isDryRun: false,
  presetId: "preset-id",
  presetMetadata: { activeMode: "parallel" },
  personaId: null,
  characterId: "character-id",
  personaAddonStates: { example: true },
  excludeMessageId: "message-id",
  rejectedSwipe: "rejected-swipe",
  regenFeedback: "try again",
  regenFeedbackPosition: "user",
  mainDispatch: {
    source: "main",
    descriptor,
    connectionDispatchRevision: "revision-1",
    dispatchKind: "concrete",
  },
  prefillCarrier,
  interceptorDeadlineAt: Date.now() + 1_000,
  boundWorkDeadlineAt: Date.now() + 900,
  signal: new AbortController().signal,
};

const guidance: DeferredGuidanceDTO = {
  id: "7c6d2b1a-5f44-4e90-8a31-2d7b9c4e6f80",
  content: "Keep the response concise.",
  role: "system",
};
const breakdown: InterceptorBreakdownEntryDTO = { messageIndex: 0, name: "injected" };
const messages: LlmMessageDTO[] = [{ role: "user", content: "hello" }];

const callback: InterceptorHandler = async (input, callbackContext) => {
  const userId: string = callbackContext.userId;
  const generationId: string = callbackContext.generationId;
  const dispatchKind: "concrete" | "roulette" | null = callbackContext.mainDispatch.dispatchKind;
  const signal: AbortSignal = callbackContext.signal;
  const metadata: unknown = callbackContext.presetMetadata;
  void userId;
  void generationId;
  void dispatchKind;
  void signal;
  void metadata;
  const boundAssembly = await spindle.generate.assemble({
    blocks: [],
    dispatch: {
      source: "main",
      expectedConnectionDispatchRevision: "revision-1",
    },
    deadlineAt: Date.now() + 900,
    signal,
  });
  const boundQuiet = await spindle.generate.quietTracked({
    messages: input,
    dispatch: {
      source: "main",
      expectedConnectionDispatchRevision: "revision-1",
    },
    deadlineAt: Date.now() + 900,
    signal,
  });
  void boundAssembly;
  void boundQuiet;
  // @ts-expect-error callback context is readonly
  callbackContext.userId = "must-not-compile";
  // @ts-expect-error nested dispatch context is readonly
  callbackContext.mainDispatch.dispatchKind = "roulette";
  return {
    messages: input,
    breakdown: [breakdown],
    deferredGuidance: [guidance],
  } satisfies InterceptorResultDTO;
};

const legacyArrayCallback: InterceptorHandler = async (input) => input;
const legacyResultCallback: InterceptorHandler = async (input) => ({ messages: input });

declare const spindle: SpindleAPI;
spindle.registerWorldInfoInterceptor(async (worldInfoContext) => {
  const globalScanDepth: number | null =
    worldInfoContext.activationSettings.globalScanDepth;
  void globalScanDepth;
});
const priorityDisposer: InterceptorDisposer = spindle.registerInterceptor(callback, 900, matchOptions);
const optionsDisposer: InterceptorDisposer = spindle.registerInterceptor(callback, options);
const handlerOnlyDisposer: InterceptorDisposer = spindle.registerInterceptor(legacyArrayCallback);
const legacyPriorityDisposer: InterceptorDisposer = spindle.registerInterceptor(legacyResultCallback, 100);
priorityDisposer();
optionsDisposer();
handlerOnlyDisposer();
legacyPriorityDisposer();

const { signal: _signal, ...wireContext } = context;
const wireIntercept: HostToWorker = {
  type: "intercept_request",
  requestId: "request-id",
  registrationId: "registration-id",
  messages,
  context: wireContext,
};
const abortIntercept: HostToWorker = {
  type: "intercept_abort",
  requestId: "request-id",
  registrationId: "registration-id",
};
const register: WorkerToHost = {
  type: "register_interceptor",
  registrationId: "registration-id",
  priority: 900,
  match,
};
const unregister: WorkerToHost = {
  type: "unregister_interceptor",
  registrationId: "registration-id",
};
const result: WorkerToHost = {
  type: "intercept_result",
  requestId: "request-id",
  registrationId: "registration-id",
  messages,
  deferredGuidance: [guidance],
};
const assembleBound: WorkerToHost = {
  type: "generate_assemble",
  requestId: "assemble-id",
  input: {
    blocks: [] as BoundAssembleRequestDTO["blocks"],
    dispatch: { source: "main", expectedConnectionDispatchRevision: "revision-1" },
    deadlineAt: Date.now() + 500,
  },
};
const quietTracked: WorkerToHost = {
  type: "generate_quiet_tracked",
  requestId: "quiet-id",
  input: {
    messages,
    dispatch: { source: "main", expectedConnectionDispatchRevision: "revision-1" },
    deadlineAt: Date.now() + 500,
  } satisfies Omit<QuietTrackedRequestDTO, "signal">,
};

void abortIntercept;
void assembleBound;
void options;
void priorityDisposer;
void quietTracked;
void register;
void result;
void unregister;
void wireIntercept;
