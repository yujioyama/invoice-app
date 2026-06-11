import type { Meta, StoryObj } from "@storybook/react";
import PasswordInput from "./PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  component: PasswordInput,
  title: "UI/PasswordInput",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    label: "Password",
    id: "password",
    placeholder: "Enter your password",
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    id: "password-error",
    error: "Password must be at least 8 characters.",
  },
};
