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

export const StableBalanced: Story = {
  args: {
    type: "stable-balanced",
    data: [10, 20, 30, 40, 50],
    legend: ["apple", "banana", "cherry", "date", "elderberry"],
  },
};

export const UnstableInverted: Story = {
  args: {
    type: "unstable-inverted",
    data: [10, 20, 30, 40, 50],
    legend: ["apple", "banana", "cherry", "date", "elderberry"],
  },
};

export const Shuffled: Story = {
  args: {
    type: "shuffled",
    data: [10, 20, 30, 40, 50],
    legend: ["apple", "banana", "cherry", "date", "elderberry"],
  },
};
