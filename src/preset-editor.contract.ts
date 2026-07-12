import type { SpindleFrontendContext } from "./dom";

/** Compile-time fixture for the additive preset-editor extension API. */
export function verifyPresetEditorContract(ctx: SpindleFrontendContext): void {
  const toolbar = ctx.ui.registerPresetEditorToolbarItem({
    id: "mode-controls",
    ariaLabel: "Agent mode controls",
  });
  toolbar.setVisible(true);
  toolbar.destroy();

  const editor = ctx.ui.presetEditor.extension;
  // @ts-expect-error Scoped helpers are acquired from a read-only getter.
  ctx.ui.presetEditor.extension = editor;
  const state = editor.getState();
  state.blocks.forEach((block) => block.id);

  editor.setMetadata({ mode: "parallel" }, { immediate: true });
  editor.updateMetadata((current) => ({
    ...(current && typeof current === "object" && !Array.isArray(current) ? current : {}),
    revision: 1,
  }));
  editor.activateBuiltinTab("blocks");
  void editor.flush();
}
