import type { SpindleAPI, DecisionBox, DecisionEvaluationInput } from "lumiverse-spindle-types";
declare const api: SpindleAPI;
const input = {
  model: "jev-preview",
  state: { page: "3f6c-page" },
  assets: { "3f6c-page": { type: "image", format: "jpg", data_base64: "/9j/4AAQ" }, "9a21-badge": { image_id: "stored-image-id" } },
  questions: {
    present: { type: "noul", instructions: "Is the person from this photo: 9a21-badge in `page`?" },
    face: { type: "box", instructions: "the face of the person in `page`" },
  },
} satisfies DecisionEvaluationInput;
const result = await api.decisions.evaluate(input);
const box: DecisionBox = result.answers.face.box;
const confidence: number = result.answers.face.confidence;
const chance: number = result.answers.present.noul;
// @ts-expect-error Box answers do not have a Noul probability.
result.answers.face.noul;
// @ts-expect-error Assets need base64 data with a format, or an image_id.
const missing: DecisionEvaluationInput = { state: "x", questions: {}, assets: { ref: { format: "png" } } };
void [box, confidence, chance, missing];
