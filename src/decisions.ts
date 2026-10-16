/** Native typed Decision API. Requires decisions permission and decisions-v1 host capability. */
/**
 * An image in `DecisionEvaluationInput.assets`. Requires the decision-images-v1 host capability and a TypeSafe connection.
 * `image_id` sends a stored Lumiverse image (PNG or JPEG) without moving its bytes through the worker; it requires the images permission.
 */
export type DecisionImageAsset =
  | { type?: "image"; format: "png" | "jpg" | "jpeg"; data_base64: string }
  | { type?: "image"; image_id: string };
/**
 * The edges in a `box` answer. A `box` question finds one target in an image; it needs an image asset and a Jev 1.14 model such as `jev-preview`.
 * Edges are fractions of the image's width (left, right) and height (top, bottom), measured from the top-left corner.
 */
export interface DecisionBox { top: number; bottom: number; left: number; right: number }
export type DecisionJsonValue = null | boolean | number | string | DecisionJsonValue[] | { [key: string]: DecisionJsonValue };
export type DecisionDescription = string | DecisionJsonValue[] | { [key: string]: DecisionJsonValue };
export type DecisionState = DecisionDescription;
export type DecisionQuestion =
  | { type: "choice"; instructions: DecisionDescription; criteria: Record<string, DecisionDescription | null> }
  | { type: "score"; instructions: DecisionDescription; criteria: DecisionDescription[] }
  | { type: "noul"; instructions: DecisionDescription; criteria?: { true: DecisionDescription; false: DecisionDescription } }
  | { type: "box"; instructions: DecisionDescription };
export type DecisionAnswer =
  | { type: "choice"; choice: string; probabilities: Record<string, number>; confidence: number }
  | { type: "score"; score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, DecisionDescription> }
  | { type: "noul"; noul: number }
  | { type: "box"; box: DecisionBox; confidence: number };
export type DecisionAnswerFor<Q extends DecisionQuestion> = Q extends { type: "choice"; criteria: infer C }
  ? Omit<Extract<DecisionAnswer, { type: "choice" }>, "choice" | "probabilities"> & { choice: Extract<keyof C, string>; probabilities: Record<Extract<keyof C, string>, number> }
  : Q extends { type: "score" } ? Extract<DecisionAnswer, { type: "score" }>
  : Q extends { type: "box" } ? Extract<DecisionAnswer, { type: "box" }> : Extract<DecisionAnswer, { type: "noul" }>;
export type DecisionAnswers<Q extends Record<string, DecisionQuestion>> = { [K in keyof Q]: DecisionAnswerFor<Q[K]> };
export interface DecisionResult<Q extends Record<string, DecisionQuestion> = Record<string, DecisionQuestion>> {
  model: string;
  answers: DecisionAnswers<Q>;
  usage?: { input_tokens?: number | null; output_tokens?: number | null; cost?: number | null; [key: string]: unknown };
  id?: string;
  provider?: string;
}
export interface DecisionEvaluationInput<Q extends Record<string, DecisionQuestion> = Record<string, DecisionQuestion>> {
  connection_id?: string;
  model?: string;
  state: DecisionState;
  questions: Q;
  /** Images keyed by a reference string; every reference must appear in `state`, `instructions`, or `criteria`. */
  assets?: Record<string, DecisionImageAsset>;
  userId?: string;
}
export interface DecisionConnectionProfileDTO {
  id: string;
  name: string;
  provider: string;
  api_url: string;
  model: string;
  is_default: boolean;
  has_api_key: boolean;
  default_parameters: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: number;
  updated_at: number;
}
export interface DecisionModelDTO {
  id: string;
  label: string;
  description?: string;
  input_modalities?: string[];
  output_modalities?: string[];
  context_length?: number;
  pricing?: Record<string, string>;
  protocol: "supported" | "unsupported" | "unverified";
}
export interface DecisionProviderDTO {
  id: string;
  name: string;
  capabilities: { apiKeyRequired: boolean; defaultUrl: string; suggestedModel: string; modelListStyle: "dynamic" };
}
export interface SpindleDecisionsAPI {
  listProviders(options?: { userId?: string }): Promise<DecisionProviderDTO[]>;
  listConnections(options?: { userId?: string }): Promise<DecisionConnectionProfileDTO[]>;
  getConnection(id: string, options?: { userId?: string }): Promise<DecisionConnectionProfileDTO | null>;
  getModels(id: string, options?: { userId?: string }): Promise<DecisionModelDTO[]>;
  evaluate<const Q extends Record<string, DecisionQuestion>>(input: DecisionEvaluationInput<Q>, options?: { signal?: AbortSignal }): Promise<DecisionResult<Q>>;
}
export type DecisionWorkerMessage =
  | { type: "decisions_providers" | "decisions_connections_list"; requestId: string; userId?: string }
  | { type: "decisions_connection_get" | "decisions_models"; requestId: string; connectionId: string; userId?: string }
  | { type: "decisions_evaluate"; requestId: string; input: DecisionEvaluationInput }
  | { type: "decisions_cancel"; requestId: string };
