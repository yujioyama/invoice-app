import type { Meta, StoryObj } from "@storybook/react";
import LoadingPage from "./LoadingPage";

const meta: Meta<typeof LoadingPage> = {
  component: LoadingPage,
  title: "UI/LoadingPage",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof LoadingPage>;

export const Default: Story = {
  args: {},
};

export const WithMessage: Story = {
  args: {
    message: "Loading invoices…",
  },
};
