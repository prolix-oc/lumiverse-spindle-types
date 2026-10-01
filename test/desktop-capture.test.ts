import { expect, test } from "bun:test";
import { ALL_PERMISSIONS, isValidPermission } from "../src/index";
import { captureWireContract, capturedContent, videoContent, deniedCapture } from "./desktop-capture-consumer";

test("desktop capture permissions and wire/content contracts are public", () => {
  expect(isValidPermission("screen_capture")).toBe(true);
  expect(isValidPermission("screen_recording")).toBe(true);
  expect(ALL_PERMISSIONS.filter(permission => permission === "screen_capture")).toHaveLength(1);
  expect(captureWireContract().type).toBe("desktop_capture_request");
  expect(capturedContent({ assetId: "asset", kind: "image", mimeType: "image/png", width: 1, height: 1, connectionId: "connection", expiresAt: 1 })).toEqual({ type: "desktop_capture", asset_id: "asset" });
  expect(videoContent().type).toBe("video");
  expect(deniedCapture().outcome).toBe("denied");
});
