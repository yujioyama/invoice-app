import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

// APIとrouterをモック
jest.mock("@/lib/apiAuth", () => ({
  login: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { login } from "@/lib/apiAuth";
const mockLogin = login as jest.MockedFunction<typeof login>;

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("メールとパスワードを入力してsubmitするとloginが呼ばれる", async () => {
    mockLogin.mockResolvedValue({ user: { id: "1" } });
    render(<LoginPage />);

    await userEvent.type(
      screen.getByLabelText("auth.login.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("auth.login.password"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.login.submit" }),
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("ログイン失敗時にエラーメッセージが表示される", async () => {
    mockLogin.mockRejectedValue(new Error("failed to login"));
    render(<LoginPage />);

    await userEvent.type(
      screen.getByLabelText("auth.login.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("auth.login.password"),
      "wrongpassword",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.login.submit" }),
    );

    await waitFor(() => {
      expect(screen.getByText("failed to login")).toBeInTheDocument();
    });
  });

  it("レート制限超過時に専用メッセージが表示される", async () => {
    mockLogin.mockRejectedValue(
      new Error("Too many login attempts. Please try again after 1 minute."),
    );
    render(<LoginPage />);

    await userEvent.type(
      screen.getByLabelText("auth.login.email"),
      "test@example.com",
    );
    await userEvent.type(
      screen.getByLabelText("auth.login.password"),
      "password123",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "auth.login.submit" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Too many login attempts. Please try again after 1 minute.",
        ),
      ).toBeInTheDocument();
    });
  });
});
