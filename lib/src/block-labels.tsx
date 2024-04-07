import { BlockItem } from "./block";

type BlockLabel = {
  x: number;
  y: number;
  text: string;
};

export type BlockLabelsProps = {
  blocks: BlockItem[];
};

export default function BlockLabels({ blocks }: BlockLabelsProps) {
  const blockLabels: BlockLabel[] = blocks.map((block) => {
    return {
      x: block.x + block.width + 20,
      y: block.y + block.height / 2,
      text: `${block.value}`,
    };
  });

  return (
    <g>
      {blockLabels.map((label, index) => (
        <text
          key={index}
          x={label.x}
          y={label.y}
          textAnchor="start"
          alignmentBaseline="middle"
          fill="black"
          fontSize="12"
        >
          {label.text}
        </text>
      ))}
    </g>
  );
}
