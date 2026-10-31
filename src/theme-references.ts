export interface SpindleThemeComponentReference {
  id: string
  category: string
  rootSelector: string | null
  classSelectors: Record<string, string>
  parts: string[]
  sources: string[]
  template: string
  props: unknown[]
  build: { version: string; hash: string }
}

export interface ThemeReferencesOperations {
  components: { args: { query?: string; offset?: number; limit?: number }; result: { total: number; items: Array<{ id: string; category: string; rootSelector: string | null }> } }
  component: { args: { id: string }; result: SpindleThemeComponentReference }
  variables: { args: { query?: string }; result: Array<{ name: string; defaultValue: string }> }
  search: { args: { query: string; kind?: 'source' | 'doc'; offset?: number; limit?: number }; result: { total: number; items: Array<{ kind: string; path: string; line: number; excerpt: string }>; build: { version: string; hash: string } } }
  read: { args: { kind: 'source' | 'doc'; path: string; startLine?: number; lineCount?: number }; result: { text: string; totalLines: number; startLine: number; endLine: number; build: { version: string; hash: string } } }
}
export type ThemeReferencesOperation = keyof ThemeReferencesOperations
export type ThemeReferencesRequest<K extends ThemeReferencesOperation = ThemeReferencesOperation> = { [P in K]: { operation: P; args: ThemeReferencesOperations[P]['args'] } }[K]
export interface ThemeReferencesAPI {
  readonly version: 1
  request<K extends ThemeReferencesOperation>(input: ThemeReferencesRequest<K>): Promise<ThemeReferencesOperations[K]['result']>
}
