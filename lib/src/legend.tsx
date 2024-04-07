type LegendProps = {
  legendItems: { name: string; color: string }[];
  svgWidth: number;
  legendWidth: number;
  legendPaddingRight: number;
  legendPaddingTop: number;
  legendItemHeight: number;
};

export default function Legend({
  legendItems,
  svgWidth,
  legendWidth,
  legendPaddingRight,
  legendPaddingTop,
  legendItemHeight,
}: LegendProps) {
  return (
    <g
      transform={`translate(${svgWidth - legendWidth - legendPaddingRight}, ${0 + legendPaddingTop})`}
    >
      {legendItems.map((item, index) => (
        <g key={index} transform={`translate(0, ${index * legendItemHeight})`}>
          <rect width="10" height="10" fill={item.color} />
          <text x="15" y="10" style={{ fontSize: "16px" }}>
            {item.name}
          </text>
        </g>
      ))}
    </g>
  );
}
