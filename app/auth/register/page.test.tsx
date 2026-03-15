import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./page";

jest.mock("@/lib/apiAuth", () => ({
  register: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { register } from "@/lib/apiAuth";
const mockRegister = register as jest.MockedFunction<typeof register>;

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームを正しく入力してsubmitするとregisterが呼ばれる", async () => {
    mockRegister.mockResolvedValue({ user: { id: "1" } });
    render(<RegisterPage />);

    await userEvent.type(
      screen.getByLabelText("auth.register.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.name"),
      "Test User",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.password"),
      "password123",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.confirmPassword"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.register.submit" }),
    );

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "test@example.com",
        "Test User",
        "password123",
      );
    });
  });

  it("パスワードが一致しない場合はエラーメッセージが表示される", async () => {
    render(<RegisterPage />);

    await userEvent.type(
      screen.getByLabelText("auth.register.email"),
      "test@example.com",
    );

    await userEvent.type(
      screen.getByLabelText("auth.register.name"),
      "Test User",
    );

    await userEvent.type(
      screen.getByLabelText("auth.register.password"),
      "password123",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.confirmPassword"),
      "different",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.register.submit" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("auth.register.passwordMismatch"),
      ).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("API失敗時にエラーメッセージが表示される", async () => {
    mockRegister.mockRejectedValue(new Error("failed to register"));
    render(<RegisterPage />);

    await userEvent.type(
      screen.getByLabelText("auth.register.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.name"),
      "Test User",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.password"),
      "password123",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.confirmPassword"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.register.submit" }),
    );

    await waitFor(() => {
      expect(screen.getByText("failed to register")).toBeInTheDocument();
    });
  });

  it("レート制限超過時に専用メッセージが表示される", async () => {
    mockRegister.mockRejectedValue(
      new Error("Too many attempts. Please try again after 1 minute."),
    );
    render(<RegisterPage />);

    await userEvent.type(
      screen.getByLabelText("auth.register.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.name"),
      "Test User",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.password"),
      "password123",
    );
    await userEvent.type(
      screen.getByLabelText("auth.register.confirmPassword"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.register.submit" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Too many attempts. Please try again after 1 minute."),
      ).toBeInTheDocument();
    });
  });
});
