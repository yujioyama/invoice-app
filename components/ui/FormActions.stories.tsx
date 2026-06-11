import type { Meta, StoryObj } from "@storybook/react";
import FormActions from "./FormActions";

const meta: Meta<typeof FormActions> = {
  component: FormActions,
  title: "UI/FormActions",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof FormActions>;

export const Default: Story = {
  args: {
    primaryLabel: "Save",
    secondaryLabel: "Cancel",
    onSecondary: () => {},
  },
};

export const PrimaryDisabled: Story = {
  args: {
    primaryLabel: "Saving…",
    primaryDisabled: true,
    secondaryLabel: "Cancel",
    onSecondary: () => {},
  },
};
