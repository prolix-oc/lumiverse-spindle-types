import { expect, test } from "bun:test";
import { ALL_PERMISSIONS, isValidPermission } from "../src/permissions";

test("decision evaluation has its own declared permission", () => {
  expect(ALL_PERMISSIONS).toContain("decisions");
  expect(isValidPermission("decisions")).toBe(true);
});
