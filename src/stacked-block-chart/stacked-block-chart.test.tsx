import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StackedBlockChart } from "./stacked-block-chart";
import type { StackedBlockDatum } from "./model/types";

function render(data: StackedBlockDatum[]) {
  return renderToStaticMarkup(
    <StackedBlockChart stackType="stable-balanced" data={data} />
  );
}

function rectsOf(markup: string) {
  return markup.match(/<rect[^>]*>/g) ?? [];
}

describe("StackedBlockChart with degenerate data", () => {
  const emptyCases: [string, StackedBlockDatum[]][] = [
    ["no data", []],
    ["a single zero value", [{ value: 0, name: "A" }]],
    [
      "only zero values",
      [
        { value: 0, name: "A" },
        { value: 0, name: "B" },
      ],
    ],
    [
      "no drawable value",
      [
        { value: Number.NaN, name: "A" },
        { value: -1, name: "B" },
      ],
    ],
  ];

  it.each(emptyCases)("renders an empty svg for %s", (_label, data) => {
    const markup = render(data);

    expect(markup).toContain("<svg");
    expect(rectsOf(markup)).toHaveLength(0);
  });

  const partialCases: [string, StackedBlockDatum[]][] = [
    [
      "a negative value",
      [
        { value: -10, name: "A" },
        { value: 20, name: "B" },
      ],
    ],
    [
      "NaN",
      [
        { value: Number.NaN, name: "A" },
        { value: 20, name: "B" },
      ],
    ],
    [
      "Infinity",
      [
        { value: Number.POSITIVE_INFINITY, name: "A" },
        { value: 20, name: "B" },
      ],
    ],
  ];

  it.each(partialCases)("drops only the datum with %s", (_label, data) => {
    const markup = render(data);

    // one block plus its legend swatch
    expect(rectsOf(markup)).toHaveLength(2);
    expect(markup).toContain(">B<");
    expect(markup).not.toContain(">A<");
  });

  it("never emits NaN or a negative size for degenerate data", () => {
    for (const [, data] of [...emptyCases, ...partialCases]) {
      const markup = render(data);

      expect(markup).not.toContain("NaN");
      expect(markup).not.toContain("Infinity");
      for (const rect of rectsOf(markup)) {
        const width = Number(/width="([^"]*)"/.exec(rect)?.[1]);
        const height = Number(/height="([^"]*)"/.exec(rect)?.[1]);
        expect(width, rect).toBeGreaterThanOrEqual(0);
        expect(height, rect).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("keeps a zero value in the legend while drawing nothing for it", () => {
    const markup = render([
      { value: 0, name: "A" },
      { value: 10, name: "B" },
    ]);

    expect(markup).toContain(">A<");
    expect(rectsOf(markup).some((rect) => /height="0"/.test(rect))).toBe(true);
  });
});
