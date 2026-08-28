import type { BlockDatum } from "../model/types";

/** A block only needs its geometry and identity to be drawn; `percentage` is
 * layout bookkeeping that never reaches the DOM. */
type Props = Omit<BlockDatum, "percentage">;

export default function Block({
  x,
  y,
  width,
  height,
  value,
  name,
  fill,
}: Props) {
  return (
    <rect x={x} y={y} width={width} height={height} fill={fill}>
      <title>{`${name}: ${value}`}</title>
    </rect>
  );
}
