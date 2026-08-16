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

const caseName = "keeps provider runtime discriminators directionally exhaustive" as const;

export function keepsProviderRuntimeDiscriminatorsDirectionallyExhaustive(): typeof caseName {
  const _checks: [_workerExact, _hostExact, _aliasWorker, _aliasHost, _runtimeExact] = [
    true,
    true,
    true,
    true,
    true,
  ];
  void _checks;
  return caseName;
}
