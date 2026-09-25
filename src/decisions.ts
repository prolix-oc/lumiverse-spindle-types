/** JSON text or structured context evaluated by a decision model. */
export type DecisionData = string | Record<string, unknown> | unknown[];

export type DecisionQuestion =
  | { type: "choice"; instructions: DecisionData; criteria: Record<string, DecisionData | null> }
  | { type: "score"; instructions: DecisionData; criteria: DecisionData[] }
  | { type: "noul"; instructions: DecisionData; criteria?: { true?: DecisionData; false?: DecisionData } };

/** Normalized across decision providers and API gateways. */
export interface DecisionRequest {
  connectionId?: string;
  state: DecisionData;
  questions: Record<string, DecisionQuestion>;
}

export type DecisionAnswer =
  | { type: "choice"; choice: string; probabilities: Record<string, number>; confidence: number }
  | { type: "score"; score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }
  | { type: "noul"; noul: number };

export interface DecisionResult {
  model: string;
  answers: Record<string, DecisionAnswer>;
  usage?: { input_tokens: number; output_tokens: number };
}

/** Permission: `decisions`. Uses the current authenticated user context. */
export interface SpindleDecisionsAPI {
  evaluate(request: DecisionRequest): Promise<DecisionResult>;
}
