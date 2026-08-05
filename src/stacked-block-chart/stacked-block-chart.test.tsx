import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import {
  StackedBlockChart,
  type StackedBlockChartProps,
} from "./stacked-block-chart";
import type { StackedBlockDatum } from "./model/types";

const data: StackedBlockDatum[] = [
  { value: 10, name: "apple" },
  { value: 20, name: "banana" },
  { value: 30, name: "cherry" },
];

function renderChart(props: Partial<StackedBlockChartProps> = {}) {
  return render(
    <StackedBlockChart stackType="stable-balanced" data={data} {...props} />
  );
}

function rectsOf(container: HTMLElement) {
  return Array.from(container.querySelectorAll("rect"));
}

describe("StackedBlockChart", () => {
  it("renders a block and a legend swatch for every datum", () => {
    const { container } = renderChart();

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(rectsOf(container)).toHaveLength(data.length * 2);
    for (const datum of data) {
      expect(screen.getByText(datum.name)).toBeInTheDocument();
    }
  });

  it("gives every block a positive, finite size", () => {
    const { container } = renderChart();

    for (const rect of rectsOf(container)) {
      const width = Number(rect.getAttribute("width"));
      const height = Number(rect.getAttribute("height"));
      expect(Number.isFinite(width)).toBe(true);
      expect(Number.isFinite(height)).toBe(true);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    }
  });

  it("renders a data label per block by default", () => {
    renderChart();

    for (const datum of data) {
      expect(screen.getByText(String(datum.value))).toBeInTheDocument();
    }
  });

  it("omits the data labels when showDataLabels is false", () => {
    renderChart({ showDataLabels: false });

    for (const datum of data) {
      expect(screen.queryByText(String(datum.value))).not.toBeInTheDocument();
    }
  });

  it("produces the same layout for the same seed", () => {
    const first = renderChart({ seed: 7 });
    const firstRects = rectsOf(first.container).map((r) => r.outerHTML);
    first.unmount();

    const second = renderChart({ seed: 7 });
    const secondRects = rectsOf(second.container).map((r) => r.outerHTML);

    expect(secondRects).toEqual(firstRects);
  });

  it("produces a different layout for a different seed", () => {
    const first = renderChart({ seed: 7 });
    const firstRects = rectsOf(first.container).map((r) => r.outerHTML);
    first.unmount();

    const second = renderChart({ seed: 8 });
    const secondRects = rectsOf(second.container).map((r) => r.outerHTML);

    expect(secondRects).not.toEqual(firstRects);
  });

  it("forwards a ref to the underlying svg element", () => {
    const ref = createRef<SVGSVGElement>();

    render(
      <StackedBlockChart stackType="stable-balanced" data={data} ref={ref} />
    );

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current).toHaveAttribute("viewBox", "0 0 400 300");
  });

  it("passes svg attributes through to the svg element", () => {
    const { container } = render(
      <StackedBlockChart
        stackType="stable-balanced"
        data={data}
        width={600}
        height={450}
        aria-label="fruit chart"
        className="my-chart"
      />
    );
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "600");
    expect(svg).toHaveAttribute("height", "450");
    expect(svg).toHaveAttribute("aria-label", "fruit chart");
    expect(svg).toHaveClass("my-chart");
    expect(svg).toHaveStyle({ maxWidth: "600px", maxHeight: "450px" });
  });
});

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

  it.each(emptyCases)("renders an empty svg for %s", (_label, degenerate) => {
    const { container } = render(
      <StackedBlockChart stackType="stable-balanced" data={degenerate} />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(rectsOf(container)).toHaveLength(0);
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

  it.each(partialCases)("drops only the datum with %s", (_label, degenerate) => {
    const { container } = render(
      <StackedBlockChart stackType="stable-balanced" data={degenerate} />
    );

    // one block plus its legend swatch
    expect(rectsOf(container)).toHaveLength(2);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });

  it("never emits NaN or a negative size for degenerate data", () => {
    for (const [, degenerate] of [...emptyCases, ...partialCases]) {
      const { container, unmount } = render(
        <StackedBlockChart stackType="stable-balanced" data={degenerate} />
      );

      for (const rect of rectsOf(container)) {
        const width = Number(rect.getAttribute("width"));
        const height = Number(rect.getAttribute("height"));
        expect(Number.isFinite(width), rect.outerHTML).toBe(true);
        expect(Number.isFinite(height), rect.outerHTML).toBe(true);
        expect(width, rect.outerHTML).toBeGreaterThanOrEqual(0);
        expect(height, rect.outerHTML).toBeGreaterThanOrEqual(0);
      }
      unmount();
    }
  });

  it("keeps a zero value in the legend while drawing nothing for it", () => {
    const { container } = render(
      <StackedBlockChart
        stackType="stable-balanced"
        data={[
          { value: 0, name: "A" },
          { value: 10, name: "B" },
        ]}
      />
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(
      rectsOf(container).some((rect) => rect.getAttribute("height") === "0")
    ).toBe(true);
  });
});
