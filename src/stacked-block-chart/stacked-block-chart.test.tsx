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

describe("StackedBlockChart accessibility", () => {
  it("exposes the chart as a single image to assistive technology", () => {
    renderChart();

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("names the chart with a default title", () => {
    renderChart();

    expect(
      screen.getByRole("img", { name: "Stacked block chart" })
    ).toBeInTheDocument();
  });

  it("names the chart with the given title", () => {
    renderChart({ title: "Fruit sales" });

    expect(screen.getByRole("img", { name: "Fruit sales" })).toBeInTheDocument();
  });

  // The accessible name resolves from <title> on its own, so this asserts the
  // aria-labelledby wiring directly. It is belt and braces for the assistive
  // technology that does not pick up a bare <title>.
  it("points aria-labelledby at the rendered title", () => {
    const { container } = renderChart({ title: "Fruit sales" });
    const title = container.querySelector("svg > title");

    expect(title).toHaveTextContent("Fruit sales");
    expect(title?.id).toBeTruthy();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-labelledby",
      title?.id
    );
  });

  it("describes the chart with the given desc", () => {
    const { container } = renderChart({ desc: "Sales for the last quarter" });
    const svg = container.querySelector("svg");
    const desc = container.querySelector("svg > desc");

    expect(desc).toHaveTextContent("Sales for the last quarter");
    expect(svg).toHaveAttribute("aria-describedby", desc?.id);
  });

  it("renders no desc when none is given", () => {
    const { container } = renderChart();

    expect(container.querySelector("svg > desc")).toBeNull();
    expect(container.querySelector("svg")).not.toHaveAttribute(
      "aria-describedby"
    );
  });

  it("leaves the chart unnamed when the title is empty", () => {
    const { container } = renderChart({ title: "" });

    expect(container.querySelector("svg > title")).toBeNull();
    expect(container.querySelector("svg")).not.toHaveAttribute(
      "aria-labelledby"
    );
  });

  it("lets a caller's aria-label win over the generated title", () => {
    const { container } = renderChart({ "aria-label": "Fruit sales" });

    expect(screen.getByRole("img", { name: "Fruit sales" })).toBeInTheDocument();
    expect(container.querySelector("svg > title")).toBeNull();
    expect(container.querySelector("svg")).not.toHaveAttribute(
      "aria-labelledby"
    );
  });

  it("lets a caller's aria-labelledby win over the generated title", () => {
    render(
      <>
        <span id="external-heading">Fruit sales</span>
        <StackedBlockChart
          stackType="stable-balanced"
          data={data}
          aria-labelledby="external-heading"
        />
      </>
    );

    expect(screen.getByRole("img", { name: "Fruit sales" })).toBeInTheDocument();
  });

  it("gives each block a native tooltip with its name and value", () => {
    const { container } = renderChart();
    const titles = Array.from(
      container.querySelectorAll("rect > title"),
      (title) => title.textContent
    );

    expect(titles).toEqual(["apple: 10", "banana: 20", "cherry: 30"]);
  });

  it("inherits the surrounding text color instead of hard coding black", () => {
    const { container } = renderChart();

    for (const text of container.querySelectorAll("text")) {
      expect(text).toHaveAttribute("fill", "currentColor");
    }
  });

  it("centers the data labels with dominant-baseline", () => {
    const { container } = renderChart();
    const label = container.querySelector("text");

    expect(label).toHaveAttribute("dominant-baseline", "middle");
    expect(label).not.toHaveAttribute("alignment-baseline");
  });
});
