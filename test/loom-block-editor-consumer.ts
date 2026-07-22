import type {
  PromptBlockDTO,
  PromptBlockPlacementBindingDTO,
  PromptBlockPlacementDTO,
  PromptBlockSnapshotDTO,
  PromptBlockCreateDTO,
  SpindleAPI,
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

/** Package-root consumer fixture for host-returned preset block snapshots. */
export async function compilePresetSnapshotContract(api: SpindleAPI): Promise<void> {
  const editableBlock: PromptBlockDTO = {
    id: "block-1",
    name: "Dialogue",
    content: "{{dialogue}}",
    role: "system",
    enabled: true,
    position: "pre_history",
    depth: 0,
    marker: null,
    isLocked: false,
    color: null,
    injectionTrigger: [],
    group: null,
  };
  const placement: PromptBlockPlacementDTO = {
    role: "assistant_append",
    position: "in_history",
    depth: 2,
  };
  const placementBinding: PromptBlockPlacementBindingDTO = {
    variableId: "layout",
    options: {
      standard: placement,
    },
  };
  const snapshot: PromptBlockSnapshotDTO = {
    ...editableBlock,
    placementBinding,
    sealed: true,
    sealedKey: "dialogue.frame",
    sealedSource: "lumihub",
    sealedOriginPresetId: "lumihub-preset",
    sealedOriginVersion: "v3",
    sealedSha256: "sha256:dialogue-frame",
  };

  const preset = await api.presets.get("preset-1");
  if (preset) {
    const fromPreset = preset.prompt_order[0];
    if (fromPreset) {
      if (fromPreset.placementBinding) {
        void fromPreset.placementBinding.variableId;
      }
      if (fromPreset.sealedSource) {
        void fromPreset.sealedSource.toUpperCase();
      }
    }
  }
  const fromList = await api.presets.blocks.list("preset-1");
  const fromListBlock = fromList[0];
  if (fromListBlock) {
    if (fromListBlock.placementBinding) {
      void fromListBlock.placementBinding.variableId;
    }
    if (fromListBlock.sealedSource) {
      void fromListBlock.sealedSource.toUpperCase();
    }
  }
  const fromGet = await api.presets.blocks.get("preset-1", "block-1");
  if (fromGet) {
    if (fromGet.placementBinding) {
      void fromGet.placementBinding.variableId;
    }
    if (fromGet.sealedSource) {
      void fromGet.sealedSource.toUpperCase();
    }
  }
  const fromCreate = await api.presets.blocks.create("preset-1", editableBlock);
  if (fromCreate.placementBinding) {
    void fromCreate.placementBinding.variableId;
  }
  if (fromCreate.sealedSource) {
    void fromCreate.sealedSource.toUpperCase();
  }
  const fromUpdate = await api.presets.blocks.update("preset-1", "block-1", {
    name: "Updated dialogue",
  });
  if (fromUpdate.placementBinding) {
    void fromUpdate.placementBinding.variableId;
  }
  if (fromUpdate.sealedSource) {
    void fromUpdate.sealedSource.toUpperCase();
  }
  const groups = await api.presets.categories.list("preset-1");
  const category = groups[0]?.categoryBlock;
  if (category) {
    if (category.placementBinding) {
      void category.placementBinding.variableId;
    }
    if (category.sealedSource) {
      void category.sealedSource.toUpperCase();
    }
  }
  const child = groups[0]?.children[0];
  if (child) {
    if (child.placementBinding) {
      void child.placementBinding.variableId;
    }
    if (child.sealedSource) {
      void child.sealedSource.toUpperCase();
    }
  }

  const forbiddenBlockPlacement: PromptBlockDTO = {
    ...editableBlock,
    // @ts-expect-error Host placement is snapshot-only.
    placementBinding,
  };
  const forbiddenBlockProvenance: PromptBlockDTO = {
    ...editableBlock,
    // @ts-expect-error Host seal state is snapshot-only.
    sealed: true,
  };
  const forbiddenCreatePlacement: PromptBlockCreateDTO = {
    name: "forbidden create",
    // @ts-expect-error Host placement is snapshot-only.
    placementBinding,
  };
  const forbiddenCreateProvenance: PromptBlockCreateDTO = {
    name: "forbidden create",
    // @ts-expect-error Host seal state is snapshot-only.
    sealed: true,
  };
  const forbiddenEditorPlacement: SpindleLoomBlockEditorValue = {
    blocks: [{
      ...editableBlock,
      // @ts-expect-error Host placement is snapshot-only.
      placementBinding,
    }],
    promptVariableValues: {},
  };
  const forbiddenEditorProvenance: SpindleLoomBlockEditorValue = {
    blocks: [{
      ...editableBlock,
      // @ts-expect-error Host seal state is snapshot-only.
      sealed: true,
    }],
    promptVariableValues: {},
  };

  // @ts-expect-error Read snapshots cannot cross the editable PromptBlockDTO boundary.
  const mutableBlockFromSnapshot: PromptBlockDTO = fromCreate;
  // @ts-expect-error Read snapshots cannot be supplied to block creation.
  await api.presets.blocks.create("preset-1", fromCreate);
  // @ts-expect-error Read snapshots cannot be supplied to block updates.
  await api.presets.blocks.update("preset-1", "block-1", fromCreate);
  const presetCreateFromSnapshot = {
    name: "forbidden preset",
    provider: "test",
    prompt_order: [fromCreate],
  };
  // @ts-expect-error Read snapshots cannot be supplied to preset creation.
  await api.presets.create(presetCreateFromSnapshot);
  const presetUpdateFromSnapshot = {
    expected_cache_revision: 0,
    prompt_order: [fromCreate],
  };
  // @ts-expect-error Read snapshots cannot be supplied to preset updates.
  await api.presets.update("preset-1", presetUpdateFromSnapshot);
  const editorValueFromSnapshot: SpindleLoomBlockEditorValue = {
    // @ts-expect-error Read snapshots cannot cross the Loom editor boundary.
    blocks: [fromCreate],
    promptVariableValues: {},
  };

  void snapshot;
  void fromList;
  void fromGet;
  void fromCreate;
  void fromUpdate;
  void category;
  void child;
  void forbiddenBlockPlacement;
  void forbiddenBlockProvenance;
  void forbiddenCreatePlacement;
  void forbiddenCreateProvenance;
  void forbiddenEditorPlacement;
  void forbiddenEditorProvenance;
  void mutableBlockFromSnapshot;
  void presetCreateFromSnapshot;
  void presetUpdateFromSnapshot;
  void editorValueFromSnapshot;
}
