export interface SpindleThemeConfiguration {
  id: string
  name: string
  mode: 'light' | 'dark' | 'system'
  accent: { h: number; s: number; l: number }
  radiusScale: number
  enableGlass: boolean
  fontScale: number
  uiScale?: number
  liquidGlass?: boolean
  characterAware?: boolean
  baseColors?: Partial<Record<'primary' | 'secondary' | 'background' | 'backgroundDeep' | 'text' | 'danger' | 'success' | 'warning' | 'speech' | 'thoughts', string>>
  baseColorsByMode?: { dark?: SpindleThemeConfiguration['baseColors']; light?: SpindleThemeConfiguration['baseColors'] }
  statusColors?: { danger?: string; success?: string; warning?: string }
  desktopBackground?: { color: string; blur?: boolean; blurIntensity?: 'subtle' | 'balanced' | 'strong' }
  renderingMode?: 'efficiency' | 'balanced' | 'quality'
}

export interface SpindleThemeDraft {
  name: string
  author?: string
  description?: string
  theme?: SpindleThemeConfiguration | null
  globalCSS?: string
  globalEnabled?: boolean
  components?: Record<string, { css: string; enabled?: boolean } | null>
  assetBundleId?: string | null
}

export interface SpindleThemeState {
  defaultTheme: SpindleThemeConfiguration
  revision: string
  theme: SpindleThemeConfiguration | null
  customCSS: { css: string; enabled: boolean; bundleId: string | null; revision: number }
  components: Record<string, { css: string; tsx: string; enabled: boolean }>
  backups: Array<{ id: string; name: string; createdAt: number }>
}

export interface SpindleThemeInstallOptions {
  expectedRevision?: string
  mode?: 'merge' | 'replace'
  apply?: boolean
  saveToLibrary?: boolean
}

export interface SpindleThemeInstallResult {
  applied: boolean
  savedToLibrary: boolean
  savedThemeId?: string
  backupId?: string
  revision: string
  bundleId: string
  warnings: string[]
}

export interface ThemeAuthoringAsset {
  id: string
  bundleId: string
  slug: string
  originalFilename: string
  mimeType: string
  sizeBytes: number
  tags: string[]
  metadata: Record<string, unknown>
  cssPath: string
  contentUrl: string
}
export interface ThemeAuthoringAssetPatch { slug?: string; tags?: string[]; metadata?: Record<string, unknown> }
export interface ThemeAuthoringOperations {
  state: { args: Record<string, never>; result: SpindleThemeState }
  validate: { args: { draft: SpindleThemeDraft }; result: { warnings: string[] } }
  install: { args: { draft: SpindleThemeDraft; options?: SpindleThemeInstallOptions }; result: SpindleThemeInstallResult }
  backup: { args: { name?: string }; result: { backupId: string; revision: string } }
  restore: { args: { backupId: string; expectedRevision: string }; result: { backupId: string; revision: string } }
  export_current: { args: Record<string, never>; result: Uint8Array }
  export_draft: { args: { draft: SpindleThemeDraft }; result: Uint8Array }
  import: { args: { bytes: Uint8Array }; result: { draft: SpindleThemeDraft; assets: ThemeAuthoringAsset[]; warnings: string[] } }
  asset_list: { args: { bundleId?: string }; result: ThemeAuthoringAsset[] }
  asset_create_bundle: { args: Record<string, never>; result: { bundleId: string } }
  asset_upload: { args: { bundleId: string; name: string; mimeType: string; bytes: Uint8Array } & ThemeAuthoringAssetPatch; result: ThemeAuthoringAsset }
  asset_update: { args: { id: string; patch: ThemeAuthoringAssetPatch }; result: ThemeAuthoringAsset }
  asset_delete: { args: { id: string }; result: { deleted: boolean } }
  asset_optimize: { args: { id: string }; result: ThemeAuthoringAsset }
  asset_download: { args: { id: string }; result: Uint8Array }
}
export type ThemeAuthoringOperation = keyof ThemeAuthoringOperations
export type ThemeAuthoringRequest<K extends ThemeAuthoringOperation = ThemeAuthoringOperation> = { [P in K]: { operation: P; args: ThemeAuthoringOperations[P]['args'] } }[K]
export interface ThemeAuthoringAPI {
  readonly version: 1
  request<K extends ThemeAuthoringOperation>(input: ThemeAuthoringRequest<K>, userId?: string): Promise<ThemeAuthoringOperations[K]['result']>
}

export type ThemeAuthoringHostRequest = Exclude<ThemeAuthoringRequest, { operation: 'import' }> | { operation: 'import'; args: { pack: unknown } }
