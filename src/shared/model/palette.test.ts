import { describe, it, expect } from "vitest";
import {
  defaultPalette,
  paletteColorAt,
  retroToy,
  toyClassic,
  woodenBlocks,
} from "./palette";

describe("paletteColorAt", () => {
  it("should return the colour for the given slot", () => {
    defaultPalette.forEach((color, index) => {
      expect(paletteColorAt(index)).toBe(color);
    });
  });

  it("should start over once the data outgrows the palette", () => {
    expect(paletteColorAt(defaultPalette.length)).toBe(defaultPalette[0]);
    expect(paletteColorAt(defaultPalette.length + 3)).toBe(defaultPalette[3]);
  });

  it("should use the given palette when one is passed", () => {
    expect(paletteColorAt(0, toyClassic)).toBe(toyClassic[0]);
    expect(paletteColorAt(toyClassic.length + 1, toyClassic)).toBe(
      toyClassic[1]
    );
  });

  it("should fall back to the default palette when the given one is empty", () => {
    expect(paletteColorAt(0, [])).toBe(defaultPalette[0]);
    expect(paletteColorAt(1, [])).toBe(defaultPalette[1]);
  });
});

describe("palettes", () => {
  it("should default to Wooden Blocks", () => {
    expect(defaultPalette).toEqual(woodenBlocks);
  });

  it.each([
    ["woodenBlocks", woodenBlocks],
    ["toyClassic", toyClassic],
    ["retroToy", retroToy],
  ])("%s holds distinct, well formed colours", (_name, palette) => {
    expect(new Set(palette).size).toBe(palette.length);
    for (const color of palette) {
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
});
