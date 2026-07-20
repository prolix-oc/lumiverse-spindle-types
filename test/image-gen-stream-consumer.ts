import type {
  HostToWorker,
  ImageGenStreamEventDTO,
  SpindleAPI,
  WorkerToHost,
} from "lumiverse-spindle-types";

declare const spindle: SpindleAPI;

async function consumePreviews(): Promise<void> {
  const stream = spindle.imageGen.generateStream({
    connection_id: "swarm-connection",
    prompt: "A quiet observatory under a starry sky",
  });

  for await (const event of stream) {
    if (event.type === "preview") {
      const preview: string = event.imageDataUrl;
      void preview;
    } else if (event.type === "status") {
      const step: number | undefined = event.step;
      void step;
    } else {
      const finalImage: string = event.result.imageDataUrl;
      void finalImage;
    }
  }
}

const event: ImageGenStreamEventDTO = { type: "status", step: 2, totalSteps: 20 };
const startStream: WorkerToHost = {
  type: "image_gen_generate_stream",
  requestId: "request-1",
  input: { prompt: "A quiet observatory under a starry sky" },
};
const preview: HostToWorker = {
  type: "image_gen_stream_chunk",
  requestId: "request-1",
  event: { type: "preview", imageDataUrl: "data:image/png;base64,preview" },
};
void event;
void startStream;
void preview;
void consumePreviews;
