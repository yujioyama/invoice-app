import type { Meta, StoryObj } from "@storybook/react";
import EmptyState from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  title: "UI/EmptyState",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Invoices: Story = {
  args: {
    message: "No invoices yet.",
    actionLabel: "Create your first invoice",
    onAction: () => {},
  },
};

export const Clients: Story = {
  args: {
    message: "No clients yet.",
    actionLabel: "Add a client",
    onAction: () => {},
  },
};
