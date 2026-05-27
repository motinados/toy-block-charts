# ToyBlockCharts

## Introduction

Charts that looks like they were made out of toy blocks.  
Please use it as an alternative if you find the expression of pie charts to be stiff.

> This library is currently in the early stages of development.
> We are constantly working to improve and optimize our codebase, which may lead to some breaking changes.
> We recommend regularly checking the latest release logs and documentation.

## Installation

```
npm install toy-block-charts
```

## Usage

## API Reference

### `StackedBlockChartProps`

| Prop | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `stackType` | Yes | `stable-balanced \| unstable-inverted \| shuffled` | - | Stacking algorithm type. |
| `data` | Yes | `{ name: string; value: number; fill?: string }[]` | - | Input data for each block segment. If `fill` is not provided, colors are assigned automatically (see `WithoutSettingFills` story behavior). |
| `seed` | No | `number` | `42` | Seed value used for reproducibility in `shuffled`-based layouts. |
| `showDataLabels` | No | `boolean` | `true` | Whether to render labels on blocks. |
| `width` / `height` | No | `ComponentPropsWithRef<"svg">["width"]` / `ComponentPropsWithRef<"svg">["height"]` | `undefined` | SVG size options. They are passed to the `<svg>` `width`/`height` attributes, while `viewBox="0 0 400 300"` is fixed. When specified, they also constrain responsive rendering via `maxWidth` / `maxHeight` styles. |

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

I have referenced the color settings from the website ["ColorLisa"](https://colorlisa.com/)
