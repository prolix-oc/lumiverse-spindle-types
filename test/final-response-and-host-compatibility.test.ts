import { expect, test } from "bun:test";
import {
  SPINDLE_COMPATIBILITY_ERROR_CODE,
  SPINDLE_HOST_CAPABILITIES,
} from "../src/host";
import { ALL_PERMISSIONS, isValidPermission } from "../src/permissions";
import { SPINDLE_THEME_AUTHORING_HOST_CAPABILITIES } from "../src/theme";

test("final-response permission is valid and publicly declared", () => {
  expect(ALL_PERMISSIONS).toContain("final_response");
  expect(isValidPermission("final_response")).toBe(true);
});

test("unrestricted regex mutation permission is valid and publicly declared", () => {
  expect(ALL_PERMISSIONS).toContain("regex_scripts_unrestricted");
  expect(isValidPermission("regex_scripts_unrestricted")).toBe(true);
});

test("host compatibility constants are canonical and immutable", () => {
  expect(SPINDLE_COMPATIBILITY_ERROR_CODE).toBe("SPINDLE_COMPATIBILITY_ERROR");
  expect(SPINDLE_HOST_CAPABILITIES).toEqual({
    "preset-extension-data-v1": 1,
    "preset-editor-v1": 1,
    "loom-block-editor-v1": 1,
    "loom-block-management-v1": 1,
    "generation-assembly-v1": 1,
    "interceptor-context-v1": 1,
    "interceptor-final-response-v1": 1,
    "connection-dispatch-resolution-v1": 1,
    "text-editor-close-v1": 1,
    "frontend-extensibility-v2": 1,
    "frontend-runtime-capabilities-v1": 1,
    "mcp-servers-v1": 1,
  });
  expect(Object.isFrozen(SPINDLE_HOST_CAPABILITIES)).toBe(true);
});

test("provider registration permissions are valid and publicly declared", () => {
  const providerPermissions = [
    "providers.embedding.register",
    "providers.tts.register",
    "providers.stt.register",
    "providers.sidecar.register",
  ] as const;
  for (const perm of providerPermissions) {
    expect(ALL_PERMISSIONS).toContain(perm);
    expect(isValidPermission(perm)).toBe(true);
  }
});

test("MCP permissions are valid and publicly declared", () => {
  for (const permission of ["mcp_servers", "mcp_servers.create"] as const) {
    expect(ALL_PERMISSIONS).toContain(permission);
    expect(isValidPermission(permission)).toBe(true);
  }
});

test("theme authoring capabilities remain frontend-specific and immutable", () => {
  expect(SPINDLE_THEME_AUTHORING_HOST_CAPABILITIES).toEqual({
    "theme-assets-v1": 1,
    "theme-packs-v1": 1,
    "theme-catalog-v1": 1,
    "theme-editor-navigation-v1": 1,
  });
  expect(Object.isFrozen(SPINDLE_THEME_AUTHORING_HOST_CAPABILITIES)).toBe(true);
  expect(SPINDLE_HOST_CAPABILITIES).not.toHaveProperty("theme-assets-v1");
});


test("speech capabilities stay frontend-specific and immutable", async () => {
  const { SPINDLE_STT_HOST_CAPABILITIES } = await import("../src/index");
  expect(SPINDLE_STT_HOST_CAPABILITIES["speech-to-text-v1"]).toBe(1);
  expect(Object.isFrozen(SPINDLE_STT_HOST_CAPABILITIES)).toBe(true);
  expect(SPINDLE_HOST_CAPABILITIES["speech-to-text-v1"]).toBeUndefined();
});
