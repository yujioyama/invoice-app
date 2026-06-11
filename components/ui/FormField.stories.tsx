import type { Meta, StoryObj } from "@storybook/react";
import FormField from "./FormField";

const meta: Meta<typeof FormField> = {
  component: FormField,
  title: "UI/FormField",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: "Email",
    id: "email",
    type: "email",
    placeholder: "you@example.com",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    id: "email-error",
    type: "email",
    placeholder: "you@example.com",
    error: "Please enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    id: "email-disabled",
    type: "email",
    value: "locked@example.com",
    disabled: true,
  },
};
