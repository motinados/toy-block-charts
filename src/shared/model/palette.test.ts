import { describe, it, expect } from "vitest";
import { palette, paletteColorAt } from "./palette";

describe("paletteColorAt", () => {
  it("should return the colour for the given slot", () => {
    palette.forEach((color, index) => {
      expect(paletteColorAt(index)).toBe(color);
    });
  });

  it("should start over once the data outgrows the palette", () => {
    expect(paletteColorAt(palette.length)).toBe(palette[0]);
    expect(paletteColorAt(palette.length + 3)).toBe(palette[3]);
  });

  it("should hold distinct colours", () => {
    expect(new Set(palette).size).toBe(palette.length);
  });
});
