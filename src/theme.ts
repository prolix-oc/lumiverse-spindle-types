import type { SpindleUploadFile } from "./dom";

/** Frontend-only host capabilities for the native theme-authoring context. */
export const SPINDLE_THEME_AUTHORING_HOST_CAPABILITIES = Object.freeze({
  "theme-assets-v1": 1,
  "theme-packs-v1": 1,
  "theme-catalog-v1": 1,
  "theme-editor-navigation-v1": 1,
} as const);

/** A native theme asset with separate browser and pack-safe references. */
export interface SpindleThemeAsset {
  id: string;
  bundleId: string;
  slug: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  /** Stable path to use from CSS stored in a native theme pack. */
  cssPath: string;
  /** Live URL suitable for browser previews and downloads. */
  contentUrl: string;
}

export interface SpindleThemeAssetUploadOptions {
  bundleId: string;
  slug?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface SpindleThemeAssetUpdate {
  slug?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/** CSS-only component input for the canonical native theme-pack adapter. */
export interface SpindleThemePackComponentDraft {
  css: string;
  enabled?: boolean;
}

/** Authoring input independent of Lumiverse's internal archive representation. */
export interface SpindleThemePackDraft {
  name: string;
  author?: string;
  description?: string;
  globalCSS: string;
  components?: Record<string, SpindleThemePackComponentDraft>;
  assetBundleId?: string | null;
}

export interface SpindleThemePackImportResult {
  draft: SpindleThemePackDraft;
  assets: SpindleThemeAsset[];
  warnings: string[];
}

export interface SpindleThemePackInstallOptions {
  apply?: boolean;
  saveToLibrary?: boolean;
}

export interface SpindleThemePackInstallResult {
  bundleId: string;
  applied: boolean;
  savedToLibrary: boolean;
  savedThemeId?: string;
  assetCount: number;
  componentCount: number;
}

/** Sanitized native component metadata; source and filesystem paths are omitted. */
export interface SpindleThemeComponentCatalogEntry {
  id: string;
  label: string;
  category: string;
  selector: string;
  hasCss: boolean;
  hasTsx: boolean;
}

export interface SpindleThemeVariableCatalogEntry {
  name: string;
  defaultValue?: string;
  value?: string;
  category?: string;
}

export type SpindleThemeEditorTarget = "global" | "assets" | "component";

export interface SpindleThemeEditorOptions {
  target?: SpindleThemeEditorTarget;
  componentId?: string;
}

/**
 * Persistent native theme-authoring integration available to frontend extensions.
 *
 * Extensions must feature-detect the corresponding `ctx.host.capabilities` key
 * before calling a capability group. This surface is distinct from the worker-side
 * `spindle.theme` live-presentation API.
 */
export interface SpindleThemeAuthoringAPI {
  /** Requires host capability `theme-assets-v1`. Mutations require `app_manipulation`. */
  readonly assets: {
    getActiveBundleId(): string | null;
    createBundle(): string;
    list(bundleId: string): Promise<SpindleThemeAsset[]>;
    upload(file: SpindleUploadFile, options: SpindleThemeAssetUploadOptions): Promise<SpindleThemeAsset>;
    update(assetId: string, patch: SpindleThemeAssetUpdate): Promise<SpindleThemeAsset>;
    delete(assetId: string): Promise<void>;
    optimizeWebp(assetId: string): Promise<SpindleThemeAsset>;
    getBytes(assetId: string): Promise<Uint8Array>;
  };
  /** Requires host capability `theme-packs-v1`. Import/install mutations require `app_manipulation`. */
  readonly packs: {
    exportDraft(draft: SpindleThemePackDraft): Promise<Uint8Array>;
    importArchive(bytes: Uint8Array): Promise<SpindleThemePackImportResult>;
    installDraft(
      draft: SpindleThemePackDraft,
      options?: SpindleThemePackInstallOptions,
    ): Promise<SpindleThemePackInstallResult>;
  };
  /** Requires host capability `theme-catalog-v1`. */
  readonly catalog: {
    listComponents(): readonly SpindleThemeComponentCatalogEntry[];
    listVariables(): readonly SpindleThemeVariableCatalogEntry[];
  };
  /** Requires host capability `theme-editor-navigation-v1`. */
  openEditor(options?: SpindleThemeEditorOptions): boolean;
}
