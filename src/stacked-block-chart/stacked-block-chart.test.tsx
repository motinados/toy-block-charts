import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import {
  StackedBlockChart,
  type StackedBlockChartProps,
} from "./stacked-block-chart";
import type { StackedBlockDatum, StackType } from "./model/types";
import { defaultPalette, retroToy } from "../shared/model/palette";
import { SVG_HEIGHT } from "../shared/model/geometry";

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

describe("StackedBlockChart colours", () => {
  /** name -> fill, read off the per-block tooltip titles. */
  function fillsByName(container: HTMLElement) {
    const entries = Array.from(
      container.querySelectorAll("rect > title"),
      (title) => [
        title.textContent?.split(":")[0] ?? "",
        (title.parentElement as Element).getAttribute("fill") ?? "",
      ]
    );
    return Object.fromEntries(entries) as Record<string, string>;
  }

  it("gives data without a fill a distinct palette colour", () => {
    const { container } = renderChart();
    const fills = Object.values(fillsByName(container));

    expect(fills).toHaveLength(data.length);
    expect(new Set(fills).size).toBe(data.length);
    for (const fill of fills) {
      expect(defaultPalette).toContain(fill);
    }
  });

  it("lets an explicit fill win over the palette", () => {
    const { container } = renderChart({
      data: [
        { value: 10, name: "apple", fill: "#123456" },
        { value: 20, name: "banana" },
      ],
    });

    expect(fillsByName(container)).toEqual({
      apple: "#123456",
      banana: defaultPalette[1],
    });
  });

  it("keeps a colour with its datum however the blocks are reordered", () => {
    const stable = renderChart({ stackType: "stable-balanced" });
    const stableFills = fillsByName(stable.container);
    stable.unmount();

    for (const stackType of ["unstable-inverted", "shuffled"] as const) {
      const { container, unmount } = renderChart({ stackType });
      expect(fillsByName(container)).toEqual(stableFills);
      unmount();
    }
  });

  it("starts the palette over when the data outgrows it", () => {
    const many = Array.from({ length: defaultPalette.length + 2 }, (_, i) => ({
      value: i + 1,
      name: `item-${i}`,
    }));

    const { container } = renderChart({ data: many });
    const fills = fillsByName(container);

    expect(fills["item-0"]).toBe(defaultPalette[0]);
    expect(fills[`item-${defaultPalette.length}`]).toBe(defaultPalette[0]);
    expect(fills[`item-${defaultPalette.length + 1}`]).toBe(defaultPalette[1]);
  });

  it("colours from the palette it is given", () => {
    const { container } = renderChart({ palette: retroToy });

    expect(fillsByName(container)).toEqual({
      apple: retroToy[0],
      banana: retroToy[1],
      cherry: retroToy[2],
    });
  });

  it("starts a given palette over when the data outgrows it", () => {
    const many = Array.from({ length: retroToy.length + 1 }, (_, i) => ({
      value: i + 1,
      name: `item-${i}`,
    }));

    const { container } = renderChart({ data: many, palette: retroToy });
    const fills = fillsByName(container);

    expect(fills[`item-${retroToy.length}`]).toBe(retroToy[0]);
  });

  it("still lets an explicit fill win over a given palette", () => {
    const { container } = renderChart({
      data: [
        { value: 10, name: "apple", fill: "#123456" },
        { value: 20, name: "banana" },
      ],
      palette: retroToy,
    });

    expect(fillsByName(container)).toEqual({
      apple: "#123456",
      banana: retroToy[1],
    });
  });

  it("falls back to the default palette when given an empty one", () => {
    const { container } = renderChart({ palette: [] });

    expect(fillsByName(container)).toEqual({
      apple: defaultPalette[0],
      banana: defaultPalette[1],
      cherry: defaultPalette[2],
    });
  });

  it("does not pass the palette on to the svg element", () => {
    const { container } = renderChart({ palette: retroToy });

    expect(container.querySelector("svg")).not.toHaveAttribute("palette");
  });
});

/**
 * Regression tests for #33, where the blocks were drawn on top of one another
 * instead of stacked. The layout used to take the whole overflow out of a single
 * block, which could turn its height negative; once the reordering moved that
 * block into the middle of the stack, the running y went backwards and the
 * blocks below it rode up over their neighbour.
 */
describe("StackedBlockChart stacking", () => {
  // The stack is laid out in floating point, so exact edges are not expected.
  const epsilon = 1e-9;
  const stackTypes: StackType[] = [
    "stable-balanced",
    "unstable-inverted",
    "shuffled",
  ];

  // Only the blocks carry a <title>; the legend swatches are bare rects.
  function blockBoxesOf(container: HTMLElement) {
    return rectsOf(container)
      .filter((rect) => rect.querySelector("title") !== null)
      .map((rect) => ({
        y: Number(rect.getAttribute("y")),
        height: Number(rect.getAttribute("height")),
      }));
  }

  function expectStacked(container: HTMLElement, expectedCount: number) {
    const boxes = blockBoxesOf(container);

    expect(boxes).toHaveLength(expectedCount);
    boxes.forEach((box, index) => {
      expect(box.height).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(-epsilon);
      expect(box.y + box.height).toBeLessThanOrEqual(SVG_HEIGHT + epsilon);

      if (index === 0) {
        return;
      }
      const above = boxes[index - 1];
      expect(box.y).toBeGreaterThanOrEqual(above.y + above.height - epsilon);
    });
  }

  it("draws every block below the one before it", () => {
    const datasets: StackedBlockDatum[][] = [
      data,
      [{ value: 5, name: "solo" }],
      [
        { value: 1, name: "a" },
        { value: 1, name: "b" },
        { value: 1, name: "c" },
      ],
      [
        { value: 1, name: "tiny" },
        { value: 900, name: "huge" },
      ],
      [
        { value: 3, name: "a" },
        { value: 8, name: "b" },
        { value: 13, name: "c" },
        { value: 21, name: "d" },
        { value: 34, name: "e" },
        { value: 55, name: "f" },
      ],
    ];

    for (const stackType of stackTypes) {
      for (let seed = 0; seed < 20; seed++) {
        for (const dataset of datasets) {
          const { container, unmount } = render(
            <StackedBlockChart
              stackType={stackType}
              data={dataset}
              seed={seed}
            />
          );

          expectStacked(container, dataset.length);
          unmount();
        }
      }
    }
  });

  it("keeps the blocks stacked when the stack overflows the canvas", () => {
    // This pair overflowed the canvas at the default seed and used to leave the
    // last block with a non-positive height.
    const overflowing: StackedBlockDatum[] = [
      { value: 20, name: "a" },
      { value: 21, name: "b" },
    ];

    for (const stackType of stackTypes) {
      const { container, unmount } = render(
        <StackedBlockChart stackType={stackType} data={overflowing} />
      );

      expectStacked(container, overflowing.length);
      for (const box of blockBoxesOf(container)) {
        expect(box.height).toBeGreaterThan(0);
      }
      unmount();
    }
  });
});
