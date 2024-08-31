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
      { value: 10, name: "apple", fill: "#A7B3CD" },
      { value: 20, name: "banana", fill: "#E6DA9E" },
      { value: 30, name: "cherry", fill: "#CCD7AD" },
      { value: 40, name: "date", fill: "#CDB296" },
      { value: 50, name: "elderberry", fill: "#676155" },
    ],
  },
};

export const UnstableInverted: Story = {
  args: {
    stackType: "unstable-inverted",
    data: [
      { value: 10, name: "apple", fill: "#A7B3CD" },
      { value: 20, name: "banana", fill: "#E6DA9E" },
      { value: 30, name: "cherry", fill: "#CCD7AD" },
      { value: 40, name: "date", fill: "#CDB296" },
      { value: 50, name: "elderberry", fill: "#676155" },
    ],
  },
};

export const Shuffled: Story = {
  args: {
    stackType: "shuffled",
    data: [
      { value: 10, name: "apple", fill: "#A7B3CD" },
      { value: 20, name: "banana", fill: "#E6DA9E" },
      { value: 30, name: "cherry", fill: "#CCD7AD" },
      { value: 40, name: "date", fill: "#CDB296" },
      { value: 50, name: "elderberry", fill: "#676155" },
    ],
  },
};

export const WithoutSettingFills: Story = {
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

export const WithoutDataLabels: Story = {
  args: {
    stackType: "stable-balanced",
    data: [
      { value: 10, name: "apple", fill: "#C04759" },
      { value: 20, name: "banana", fill: "#3B6C73" },
      { value: 30, name: "cherry", fill: "#383431" },
      { value: 40, name: "date", fill: "#F1D87F" },
      { value: 50, name: "elderberry", fill: "#EDE5D2" },
    ],
    showDataLabels: false,
  },
};

export const SameValue: Story = {
  args: {
    stackType: "stable-balanced",
    data: [
      { value: 10, name: "apple", fill: "#C04759" },
      { value: 10, name: "banana", fill: "#3B6C73" },
      { value: 10, name: "cherry", fill: "#383431" },
      { value: 10, name: "date", fill: "#F1D87F" },
      { value: 10, name: "elderberry", fill: "#EDE5D2" },
    ],
  },
};

export const Seeded: Story = {
  args: {
    stackType: "stable-balanced",
    data: [
      { value: 10, name: "apple", fill: "#4E7989" },
      { value: 20, name: "banana", fill: "#A9011B" },
      { value: 30, name: "cherry", fill: "#E4A826" },
      { value: 40, name: "date", fill: "#80944E" },
      { value: 50, name: "elderberry", fill: "#DCD6B2" },
    ],
    seed: 100,
  },
};
