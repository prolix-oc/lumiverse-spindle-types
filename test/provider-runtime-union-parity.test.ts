import { describe, expect, test } from "bun:test";
import { keepsProviderRuntimePayloadsDeeplyEqualToCoreWireSchema } from "./provider-runtime-union-parity";

describe("provider runtime wire parity", () => {
  test("canonical payloads are deeply equal to core wire schema", () => {
    expect(keepsProviderRuntimePayloadsDeeplyEqualToCoreWireSchema()).toBe(
      "keeps provider runtime payloads deeply equal to core wire schema",
    );
  });
});
