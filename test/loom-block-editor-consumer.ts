import type {
  SpindleComponentTarget,
  SpindleComponentsHelper,
  SpindleLoomBlockEditorHandle,
  SpindleLoomBlockEditorOptions,
  SpindleLoomBlockEditorValue,
} from "lumiverse-spindle-types";

/**
 * Package-root consumer fixture: this function is never called at runtime.
 * Its body intentionally exercises the complete controlled Loom editor API so
 * a consumer is checked against the package entry point rather than an
 * internal source module.
 */
export function compileLoomBlockEditorContract(
  helper: SpindleComponentsHelper,
  target: SpindleComponentTarget,
  options: SpindleLoomBlockEditorOptions,
): Promise<void> {
  const handle: SpindleLoomBlockEditorHandle = helper.mountLoomBlockEditor(target, options);
  const initial: SpindleLoomBlockEditorValue = handle.getValue();

  handle.update({
    value: initial,
    onChange: (next: SpindleLoomBlockEditorValue) => {
      const checked: SpindleLoomBlockEditorValue = next;
      void checked;
    },
    readOnly: !options.readOnly,
    compact: !options.compact,
  });

  const updated: SpindleLoomBlockEditorValue = handle.getValue();
  const refreshed: Promise<void> = handle.refreshMacros();
  handle.destroy();

  void updated;
  return refreshed;
}
