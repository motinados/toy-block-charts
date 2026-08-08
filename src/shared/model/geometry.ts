/**
 * The chart canvas. Every chart draws into this fixed viewBox and is scaled by
 * the consumer through the svg width/height, so these are the one definition of
 * the drawing area rather than per-component copies.
 */
export const SVG_WIDTH = 400;
export const SVG_HEIGHT = 300;

/** The column on the right reserved for the legend. */
export const LEGEND_WIDTH = 100;
export const LEGEND_ITEM_HEIGHT = 16;
export const LEGEND_PADDING_TOP = 10;
export const LEGEND_PADDING_RIGHT = 10;

/** Calculate the height and return it by receiving the area and width */
export function calcHeight(area: number, width: number) {
  return area / width;
}
