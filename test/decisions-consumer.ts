import type { DecisionRequest, DecisionResult, SpindleAPI, SpindleFrontendContextV2, SpindleManifest, WorkerToHost } from "lumiverse-spindle-types";

const request: DecisionRequest = {
  state: { ticket: "Need a refund" },
  questions: {
    route: { type: "choice", instructions: "Which team?", criteria: { billing: null, support: "Other issue" } },
    severity: { type: "score", instructions: { question: "How severe?" }, criteria: ["Low", "High"] },
    urgent: { type: "noul", instructions: "Urgent?", criteria: { true: "Yes", false: "No" } },
  },
};

const manifestPermission: SpindleManifest["permissions"] = ["decisions"];
const workerMessage: WorkerToHost = { type: "decisions_evaluate", requestId: "request", input: request };

declare const spindle: SpindleAPI;
declare const context: SpindleFrontendContextV2;
const backendResult: Promise<DecisionResult> = spindle.decisions.evaluate(request);
const frontendResult: Promise<DecisionResult> = context.decisions.evaluate(request);
void [manifestPermission, workerMessage, backendResult, frontendResult];
