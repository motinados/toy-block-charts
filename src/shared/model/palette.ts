/**
 * Fills used for data that does not carry its own `fill`.
 *
 * The order is part of the design, not cosmetic: it was chosen by validating
 * candidate orderings rather than by eye. Against a white surface every slot
 * sits inside the usable lightness band, clears the chroma floor so none reads
 * as gray, and reaches 3:1 contrast; the first five are separable from each
 * other in every pairing, including under simulated colour-vision deficiency.
 *
 * Past five, and for the worst pairing across all eight, separation leans on
 * the chart's other channels — the legend, the data labels and the per-block
 * tooltip — so identity never rests on colour alone. Charts with more than a
 * handful of categories are better served by passing explicit `fill` values.
 */
export const palette = [
  "#C08A00",
  "#3A54A8",
  "#C2417F",
  "#00879B",
  "#2F6B1F",
  "#D2622E",
  "#7B3FA0",
  "#C0392B",
] as const;

/**
 * The fill for the nth datum. Colours repeat once the data outgrows the
 * palette, so the index is the datum's position in the caller's `data` array:
 * a colour follows its entry, and does not move when the layout reorders the
 * blocks.
 */
export function paletteColorAt(index: number): string {
  return palette[index % palette.length];
}
