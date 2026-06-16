import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

const mockPush = jest.fn();
const mockSetUser = jest.fn();

jest.mock("@/lib/apiAuth", () => ({
  login: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ setUser: mockSetUser }),
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

  it("ログイン成功時にsetUserとdashboardへの遷移が行われる", async () => {
    const user = { id: "1", email: "test@example.com", name: "Test" };
    mockLogin.mockResolvedValue({ user });
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
      expect(mockSetUser).toHaveBeenCalledWith(user);
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("デモボタンをクリックするとデモ認証情報でloginが呼ばれる", async () => {
    mockLogin.mockResolvedValue({ user: { id: "1" } });
    render(<LoginPage />);

    await userEvent.click(
      screen.getByRole("button", { name: "auth.login.demo" }),
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test.carey@example.com",
        "test",
      );
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

  it("デモログイン失敗時にエラーメッセージが表示される", async () => {
    mockLogin.mockRejectedValue(new Error("failed to login"));
    render(<LoginPage />);

    await userEvent.click(
      screen.getByRole("button", { name: "auth.login.demo" }),
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
