export type { BlockDatum, LegendItem } from "../../shared/model/types";

export type StackType = "stable-balanced" | "unstable-inverted" | "shuffled";

export type StackedBlockDatum = {
  value: number;
  name: string;
  fill?: string;
};
