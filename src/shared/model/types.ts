/** A block after layout: what a chart hands to the shared components. */
export type BlockDatum = {
  value: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  percentage: number;
};

export type LegendItem = {
  name: string;
  color: string;
};
