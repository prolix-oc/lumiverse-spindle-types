import { expect, test } from "bun:test";
import {
  SPINDLE_COMPATIBILITY_ERROR_CODE,
  SPINDLE_HOST_CAPABILITIES,
} from "../src/host";
import { ALL_PERMISSIONS, isValidPermission } from "../src/permissions";

test("final-response permission is valid and publicly declared", () => {
  expect(ALL_PERMISSIONS).toContain("final_response");
  expect(isValidPermission("final_response")).toBe(true);
});

test("host compatibility constants are canonical and immutable", () => {
  expect(SPINDLE_COMPATIBILITY_ERROR_CODE).toBe("SPINDLE_COMPATIBILITY_ERROR");
  expect(SPINDLE_HOST_CAPABILITIES).toEqual({
    "preset-extension-data-v1": 1,
    "preset-editor-v1": 1,
    "loom-block-editor-v1": 1,
    "generation-assembly-v1": 1,
    "interceptor-context-v1": 1,
    "interceptor-final-response-v1": 1,
    "text-editor-close-v1": 1,
  });
  expect(Object.isFrozen(SPINDLE_HOST_CAPABILITIES)).toBe(true);
});
