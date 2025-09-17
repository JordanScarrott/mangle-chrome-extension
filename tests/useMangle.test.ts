import { describe, it, expect } from "vitest";
import { useMangle } from "../src/composables/useMangle";

describe("useMangle", () => {
    it("mangles text correctly", () => {
        const { mangle } = useMangle();
        const result = mangle("hello");
        expect(result).toBe("olleh");
    });
});
