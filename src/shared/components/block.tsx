type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  name: string;
  fill: string;
};

export type BlockItem = Props;

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
