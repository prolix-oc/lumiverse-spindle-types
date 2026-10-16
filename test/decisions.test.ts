import { expect, test } from "bun:test";
import { ALL_PERMISSIONS, isValidPermission, SPINDLE_HOST_CAPABILITIES } from "../src/index";
test("exports the Decision permission and host capability", () => {
  expect(ALL_PERMISSIONS.filter((permission) => permission === "decisions")).toHaveLength(1);
  expect(isValidPermission("decisions")).toBe(true);
  expect(SPINDLE_HOST_CAPABILITIES["decisions-v1"]).toBe(1);
  expect(SPINDLE_HOST_CAPABILITIES["decision-images-v1"]).toBe(1);
});
