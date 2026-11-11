import { expect, test } from "bun:test";
import { SPINDLE_FRONTEND_UUID_HOST_CAPABILITIES, SPINDLE_HOST_CAPABILITIES } from "../src/index";

test("frontend UUID capability is immutable and separate from backend UUID support", () => {
  expect(SPINDLE_FRONTEND_UUID_HOST_CAPABILITIES).toEqual({ "frontend-uuid-v1": 1 });
  expect(Object.isFrozen(SPINDLE_FRONTEND_UUID_HOST_CAPABILITIES)).toBe(true);
  expect(SPINDLE_HOST_CAPABILITIES["uuid-v1"]).toBe(1);
  expect(SPINDLE_HOST_CAPABILITIES).not.toHaveProperty("frontend-uuid-v1");
});
