type LegendProps = {
  items: { name: string; color: string }[];
  /** svgWidth is the width of the parent element. */
  svgWidth: number;
  /** width is the width of the legend. */
  width: number;
  paddingRight: number;
  paddingTop: number;
  itemHeight: number;
};

export default function Legend({
  items,
  svgWidth,
  width,
  paddingRight,
  paddingTop,
  itemHeight,
}: LegendProps) {
  return (
    <g
      transform={`translate(${svgWidth - width - paddingRight}, ${0 + paddingTop})`}
    >
      {items.map((item, index) => (
        <g key={index} transform={`translate(0, ${index * itemHeight})`}>
          <rect width="10" height="10" fill={item.color} />
          <text x="15" y="10" style={{ fontSize: "16px" }}>
            {item.name}
          </text>
        </g>
      ))}
    </g>
  );
}
