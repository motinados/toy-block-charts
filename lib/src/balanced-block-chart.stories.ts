import type { Meta, StoryObj } from "@storybook/react";
import BalancedBlockChart from "./balanced-block-chart";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Chart",
  component: BalancedBlockChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof BalancedBlockChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: [10, 20, 30, 40, 50],
  },
};
