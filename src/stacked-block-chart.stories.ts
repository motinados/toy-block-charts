import type { Meta, StoryObj } from "@storybook/react";
import { StackedBlockChart } from "./stacked-block-chart";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/StackedBlockChart",
  component: StackedBlockChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof StackedBlockChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StableBalanced: Story = {
  args: {
    stackType: "stable-balanced",
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
    stackType: "unstable-inverted",
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
    stackType: "shuffled",
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
    stackType: "stable-balanced",
    data: [
      { value: 10, name: "apple", color: "#ff0000" },
      { value: 20, name: "banana", color: "#00ff00" },
      { value: 30, name: "cherry", color: "#0000ff" },
      { value: 40, name: "date", color: "#ffff00" },
      { value: 50, name: "elderberry", color: "#00ffff" },
    ],
  },
};

export const WithoutDataLabels: Story = {
  args: {
    stackType: "stable-balanced",
    data: [
      { value: 10, name: "apple" },
      { value: 20, name: "banana" },
      { value: 30, name: "cherry" },
      { value: 40, name: "date" },
      { value: 50, name: "elderberry" },
    ],
    showDataLabels: false,
  },
};

export const SameValue: Story = {
  args: {
    stackType: "stable-balanced",
    data: [
      { value: 10, name: "apple" },
      { value: 10, name: "banana" },
      { value: 10, name: "cherry" },
      { value: 10, name: "date" },
      { value: 10, name: "elderberry" },
    ],
  },
};
