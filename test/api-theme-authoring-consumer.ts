import type { SpindleAPI, SpindleFrontendContext } from "lumiverse-spindle-types";
declare const spindle: SpindleAPI;
declare const ctx: SpindleFrontendContext;
async function author() {
  const api = spindle.theme.authoring;
  if (!api) return;
  const state = await api.request({ operation: "state", args: {} }, "user");
  const revision: string = state.revision;
  const applied = await api.request({ operation: "install", args: { draft: { name: "Theme", globalCSS: "body{}" }, options: { expectedRevision: revision } } }, "user");
  const backup: string | undefined = applied.backupId;
  const bytes: Uint8Array = await api.request({ operation: "export_current", args: {} }, "user");
  const imported = await api.request({ operation: "import", args: { bytes } }, "user");
  const name: string = imported.draft.name;
  const inspected = ctx.theme.inspect?.({ selector: '[data-component="Badge"]', properties: ["color"], limit: 5 });
  const count: number | undefined = inspected?.count;
  const reference = await spindle.theme.references?.request({ operation: "component", args: { id: "Badge" } });
  const hash: string | undefined = reference?.build.hash;
  // @ts-expect-error Install requires a draft.
  await api.request({ operation: "install", args: { id: "wrong" } });
  // @ts-expect-error Import accepts bytes at the public boundary.
  await api.request({ operation: "import", args: { pack: {} } });
  return { backup, name, count, hash };
}
void author;
