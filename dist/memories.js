/**
 * Memory Cortex & Long-Term Chat Memory DTOs.
 *
 * Surfaces the Lumiverse hybrid memory architecture to extensions via the
 * `memories` permission. Covers:
 *
 *  - Memory Cortex
 *      • config (entity tracking, salience scoring, retrieval tuning)
 *      • retrieval (cortex query, linked-cortex query, vault query)
 *      • entity graph (entities, relations, mentions)
 *      • consolidations & salience records
 *      • vaults (snapshots of cortex state) and chat links (vault attach /
 *        bidirectional interlinks)
 *      • ingestion / maintenance telemetry
 *
 *  - Long-Term Chat Memory
 *      • vectorized chat chunks (list, get, warm)
 *      • cached retrieval result for the {{memories}} macro
 *
 * Service-layer shapes use camelCase; SQLite row shapes (snake_case) are not
 * exposed to extensions — DTOs are normalised here.
 */
export {};
