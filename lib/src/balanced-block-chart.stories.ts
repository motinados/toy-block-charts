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
    data: [
      { value: 10, name: "apple" },
      { value: 20, name: "banana" },
      { value: 30, name: "cherry" },
      { value: 40, name: "date" },
      { value: 50, name: "elderberry" },
    ],
  },
};

export const UnstableInverted: Story = {
  args: {
    type: "unstable-inverted",
    data: [
      { value: 10, name: "apple" },
      { value: 20, name: "banana" },
      { value: 30, name: "cherry" },
      { value: 40, name: "date" },
      { value: 50, name: "elderberry" },
    ],
  },
};

export const Shuffled: Story = {
  args: {
    type: "shuffled",
    data: [
      { value: 10, name: "apple" },
      { value: 20, name: "banana" },
      { value: 30, name: "cherry" },
      { value: 40, name: "date" },
      { value: 50, name: "elderberry" },
    ],
  },
};

export const WithCustomColors: Story = {
  args: {
    type: "stable-balanced",
    data: [
      { value: 10, name: "apple", color: "#ff0000" },
      { value: 20, name: "banana", color: "#00ff00" },
      { value: 30, name: "cherry", color: "#0000ff" },
      { value: 40, name: "date", color: "#ffff00" },
      { value: 50, name: "elderberry", color: "#00ffff" },
    ],
  },
};
