/**
 * Gated permissions that extensions must declare in spindle.json.
 *
 * Free tier (no declaration needed): events, storage, macros, dom, variables
 *
 * Gated tier (must declare):
 * - "generation"           — fire generations on behalf of user
 * - "interceptor"          — pre-generation prompt modification
 * - "tools"                — register LLM tools
 * - "cors_proxy"           — use CORS proxy
 * - "context_handler"      — register global context middleware
 * - "generation_parameters" — inject parameters into in-flight generations via interceptors
 * - "characters"           — CRUD on character cards
 * - "chats"                — CRUD on chat sessions
 * - "presets"              — CRUD on user presets and prompt blocks
 * - "personas"             — CRUD on personas
 * - "databanks"            — CRUD on databanks and their documents
 * - "memories"             — CRUD on the Memory Cortex (entities, relations, vaults, chat
 *                            links, consolidations) and long-term chat memory (vectorized
 *                            chat-chunk retrieval, warmup, cache).
 * - "media"                — invoke the backend media pipeline for audio/video conversion,
 *                            transcoding, muxing, and simple image+audio composition.
 * - "macro_interceptor"    — transform raw templates before macro parsing/dispatch
 * - "web_search"           — execute searches via the user's configured web search
 *                            provider (e.g. SearXNG) and read the safe view of their
 *                            web search settings (never the API key).
 * - "unsafe_eval"          — opt a sandboxed widget frame into CSP 'unsafe-eval'
 *                            (eval / new Function) for runtime-compiling frameworks.
 * - "final_response"        — replace the authoritative assistant response from
 *                            an interceptor (privileged; never auto-granted)
 * - "regex_scripts_unrestricted" — update/delete any regex script in the user's
 *                            library (privileged; additive to "regex_scripts")
 * - "providers.embedding.register" — register an embedding provider driver
 * - "providers.tts.register"       — register a TTS engine
 * - "providers.stt.register"       — register an STT engine
 * - "providers.sidecar.register"   — register a sidecar HTTP endpoint
 */
export type SpindlePermission = "generation" | "interceptor" | "tools" | "cors_proxy" | "context_handler" | "ephemeral_storage" | "chat_mutation" | "event_tracking" | "ui_panels" | "app_manipulation" | "oauth" | "characters" | "chats" | "presets" | "world_books" | "regex_scripts" | "regex_scripts_unrestricted" | "databanks" | "memories" | "media" | "personas" | "push_notification" | "image_gen" | "images" | "generation_parameters" | "macro_interceptor" | "web_search" | "unsafe_eval" | "final_response" | "providers.embedding.register" | "providers.tts.register" | "providers.stt.register" | "providers.sidecar.register";
export declare const ALL_PERMISSIONS: readonly SpindlePermission[];
export declare function isValidPermission(p: string): p is SpindlePermission;
