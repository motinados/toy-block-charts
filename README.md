# ToyBlockCharts

## Introduction

Charts that looks like they were made out of toy blocks.  
Please use it as an alternative if you find the expression of pie charts to be stiff.

> This library is currently in the early stages of development.
> We are constantly working to improve and optimize our codebase, which may lead to some breaking changes.
> We recommend regularly checking the latest release logs and documentation.

**[Live examples (Storybook)](https://motinados.github.io/toy-block-charts/)**

## Installation

```
npm install toy-block-charts
```

React 18 or 19 is required as a peer dependency.

## Usage

```tsx
import { StackedBlockChart } from "toy-block-charts";

export function FruitSales() {
  return (
    <StackedBlockChart
      stackType="stable-balanced"
      data={[
        { name: "apple", value: 10 },
        { name: "banana", value: 20 },
        { name: "orange", value: 30 },
      ]}
      title="Fruit sales"
    />
  );
}
```

The chart renders a single `<svg>` with a fixed `viewBox="0 0 400 300"`. By
default it fills the width of its container and keeps its aspect ratio, so size
it with the surrounding layout or with the `width` / `height` props.

Text inside the chart uses `currentColor` and inherits the surrounding font, so
labels and the legend follow the colour and typeface of the page around them.

Layout is randomised but **deterministic**: the same `data` and `seed` always
produce the same chart. Change `seed` to get a different arrangement.

```tsx
<StackedBlockChart stackType="shuffled" data={data} seed={7} />
```

Pass `fill` to choose colours yourself; anything without one is coloured from
the built-in palette.

```tsx
<StackedBlockChart
  stackType="stable-balanced"
  data={[
    { name: "apple", value: 10, fill: "#C04759" },
    { name: "banana", value: 20, fill: "#3B6C73" },
  ]}
/>
```

## API Reference

### `StackedBlockChartProps`

Any other `<svg>` attribute — `className`, `style`, `onClick`, `aria-*` and so
on — is passed straight through, and `ref` is forwarded to the `<svg>` element.

| Prop | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `stackType` | Yes | `stable-balanced \| unstable-inverted \| shuffled` | - | Stacking algorithm type. |
| `data` | Yes | `{ name: string; value: number; fill?: string }[]` | - | Input data for each block segment. Blocks are sized by area, so entries whose `value` is negative or not a finite number are dropped, and a `value` of `0` keeps its legend entry while drawing nothing. If `fill` is omitted the block takes its colour from the palette below. |
| `seed` | No | `number` | `42` | Seed for the randomised layout. The same data and seed always render the same chart. |
| `showDataLabels` | No | `boolean` | `true` | Whether to render value labels beside the blocks. |
| `palette` | No | `readonly string[]` | `woodenBlocks` | Colours for data that has no `fill` of its own. A colour is taken by the entry's position in `data`, and the palette starts over once the data outgrows it. An empty array falls back to the default palette. |
| `title` | No | `string` | `"Stacked block chart"` | Accessible name, rendered as `<title>`. Pass `""` to leave the chart unnamed; passing your own `aria-label` or `aria-labelledby` takes precedence over it. |
| `desc` | No | `string` | `undefined` | Longer description, rendered as `<desc>` and referenced by `aria-describedby`. |
| `width` / `height` | No | `ComponentPropsWithRef<"svg">["width"]` / `ComponentPropsWithRef<"svg">["height"]` | `undefined` | SVG size options. They are passed to the `<svg>` `width`/`height` attributes, while `viewBox="0 0 400 300"` is fixed. When specified, they also constrain responsive rendering via `maxWidth` / `maxHeight` styles. |

### Accessibility

The chart is exposed as a single image (`role="img"`) named by `title` and
described by `desc`. Each block also carries a `<title>` of `"name: value"`,
which browsers show as a tooltip on hover.

Because `role="img"` makes the chart a leaf in the accessibility tree, a screen
reader announces the name and description but not the individual values — use
`desc` to summarise the data, or present the numbers alongside the chart.

### Palettes

Data without an explicit `fill` is coloured from a palette, by its position in
the `data` array. A colour therefore stays with its entry no matter how the
layout reorders the blocks, and colours repeat once the data outgrows the
palette.

Three palettes ship with the library. **Wooden Blocks** is the default.

| Palette | Colours |
| --- | --- |
| `woodenBlocks` (default) | `#C65D4B` `#D6A84B` `#6F8FAF` `#7D9A72` `#B9825A` `#8B728E` |
| `toyClassic` | `#D94B4B` `#E9B949` `#4B78C2` `#5B9A68` `#E27A3F` `#8A67AB` |
| `retroToy` | `#C04759` `#3B6C73` `#F1D87F` `#72936B` `#D9844A` `#7A668A` |

To use one of the others, or a palette of your own, pass it as `palette`:

```tsx
import { StackedBlockChart, toyClassic } from "toy-block-charts";

<StackedBlockChart
  stackType="stable-balanced"
  data={[
    { name: "apple", value: 10 },
    { name: "banana", value: 20 },
  ]}
  palette={toyClassic}
/>;
```

An entry that carries its own `fill` keeps it, whatever `palette` says.

These palettes are warm and muted to match the toy-block look. That character
has a cost worth knowing: several hues in each set sit close together, so colour
alone will not always separate one block from another — particularly for readers
with a colour-vision deficiency. The legend, the value labels and the per-block
tooltip are what carry identity, so keep at least one of them on. Where two
specific categories must be told apart at a glance, set their `fill` explicitly.

### Stable Balanced

![stable balanced chart](./assets/image-stable-balanced.jpg)

```tsx
<StackedBlockChart
  stackType="stable-balanced"
  data={[
    { name: "apple", value: 10 },
    { name: "banana", value: 20 },
    { name: "orange", value: 30 },
    { name: "grape", value: 40 },
    { name: "kiwi", value: 50 },
  ]}
/>
```

### Unstable Inverted

![unstable inverted chart](./assets/image-unstable-inverted.jpg)

```tsx
<StackedBlockChart
  stackType="unstable-inverted"
  data={[
    { name: "apple", value: 10 },
    { name: "banana", value: 20 },
    { name: "orange", value: 30 },
    { name: "grape", value: 40 },
    { name: "kiwi", value: 50 },
  ]}
/>
```

### Shuffled

![shuffled chart](./assets/image-shuffled.jpg)

```tsx
<StackedBlockChart
  stackType="shuffled"
  data={[
    { name: "apple", value: 10 },
    { name: "banana", value: 20 },
    { name: "orange", value: 30 },
    { name: "grape", value: 40 },
    { name: "kiwi", value: 50 },
  ]}
/>
```

## Acknowledgment of Color Scheme

The colours used in the examples and stories are taken from
["ColorLisa"](https://colorlisa.com/).
