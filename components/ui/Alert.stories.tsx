import type { Meta, StoryObj } from "@storybook/react";
import Alert from "./Alert";

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: "UI/Alert",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Error: Story = {
  args: {
    message: "Invalid email or password.",
    variant: "error",
  },
};

export const Success: Story = {
  args: {
    message: "Your account has been created successfully.",
    variant: "success",
  },
};
