/**
 * Fills used for data that does not carry its own `fill`.
 *
 * A colour is taken by the datum's position in the caller's `data` array, so it
 * stays with that entry however the layout reorders the blocks, and colours
 * start over once the data outgrows the palette.
 *
 * These are warm, muted sets chosen to match the toy-block look. That character
 * comes at a cost worth knowing about: several of the hues sit close together,
 * so colour alone does not reliably separate every pair — the legend, the value
 * labels and the per-block tooltip are what carry identity. For charts with many
 * categories, or where readers must tell two specific series apart, pass
 * explicit `fill` values.
 */
export const woodenBlocks = [
  "#C65D4B",
  "#D6A84B",
  "#6F8FAF",
  "#7D9A72",
  "#B9825A",
  "#8B728E",
] as const;

export const toyClassic = [
  "#D94B4B",
  "#E9B949",
  "#4B78C2",
  "#5B9A68",
  "#E27A3F",
  "#8A67AB",
] as const;

export const retroToy = [
  "#C04759",
  "#3B6C73",
  "#F1D87F",
  "#72936B",
  "#D9844A",
  "#7A668A",
] as const;

/** The palette used when a datum has no `fill` of its own. */
export const defaultPalette: readonly string[] = woodenBlocks;

/**
 * The fill for the nth datum, repeating once the data outgrows the palette.
 */
export function paletteColorAt(
  index: number,
  palette: readonly string[] = defaultPalette
): string {
  return palette[index % palette.length];
}
