/**
 * Fills used for data that does not carry its own `fill`.
 *
 * A colour is taken by the datum's position in the caller's `data` array, so it
 * stays with that entry however the layout reorders the blocks, and colours
 * start over once the data outgrows the palette.
 */

/**
 * Saturated primaries, like a box of plastic bricks, and the default.
 *
 * The colours differ in lightness as well as hue, so every pair stays
 * apart under simulated protanopia, deuteranopia and tritanopia too. Colour is
 * still not the only cue a reader should get: the legend, the value labels and
 * the per-block tooltip are what carry identity once the data outgrows the six
 * colours and they repeat.
 */
export const brightBricks = [
  "#D62828",
  "#FFC21A",
  "#1D63D6",
  "#3BB273",
  "#4CC9F0",
  "#6A2C91",
] as const;

/**
 * The palettes below are warm and muted. That character comes at a cost worth
 * knowing about: several of the hues sit close together, so colour alone does
 * not reliably separate every pair. For charts with many categories, or where
 * readers must tell two specific series apart, prefer `brightBricks` or pass
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
export const defaultPalette: readonly string[] = brightBricks;

/**
 * The fill for the nth datum, repeating once the data outgrows the palette.
 *
 * A palette can reach here from a caller, so an empty one has to mean something:
 * it has no colour to give, and falling back to the default keeps every block
 * drawable rather than leaving it without a fill.
 */
export function paletteColorAt(
  index: number,
  palette: readonly string[] = defaultPalette
): string {
  const colors = palette.length > 0 ? palette : defaultPalette;
  return colors[index % colors.length];
}
