type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

export type BlockItem = Props;

export default function Block({ x, y, width, height, fill }: Props) {
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
}
