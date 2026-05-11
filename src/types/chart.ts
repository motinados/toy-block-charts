export type StackType = "stable-balanced" | "unstable-inverted" | "shuffled";

export type StackedBlockDatum = {
  value: number;
  name: string;
  fill?: string;
};

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
