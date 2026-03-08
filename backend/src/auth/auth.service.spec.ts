import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";

// Methods like findUnique are not implemented by me, so I need to create mock implementations for them to use in tests.
// This allows me to simulate database interactions without needing a real database connection.
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  bankAccount: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

// JwtServiceの偽物（モック）を定義
const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock-jwt-token"),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    // テスト用のNestJSモジュールを作る
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService }, // use the mock instead of the real PrismaService
        { provide: JwtService, useValue: mockJwtService }, // use the mock instead of the real JwtService
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  it("AuthServiceが定義されている", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    // テストで使う偽のユーザーデータ
    const mockUser = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      password: "hashedPassword123",
      isVerified: true,
    };

    it("正しい認証情報でログインするとJWTトークンが返る", async () => {
      // 準備: DBからユーザーが見つかる & パスワードが一致する という状況を作る
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(require("bcryptjs"), "compare").mockResolvedValue(true);

      // 実行
      const result = await service.login({
        email: "test@example.com",
        password: "correctPassword",
      });

      // 検証
      expect(result.token).toBe("mock-jwt-token");
      expect(result.user.email).toBe("test@example.com");
    });

    it("パスワードが間違っている場合はUnauthorizedExceptionが投げられる", async () => {
      // 準備: DBからユーザーは見つかるが、パスワードが不一致
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(require("bcryptjs"), "compare").mockResolvedValue(false);

      // 実行 & 検証: エラーが投げられることを確認
      await expect(
        service.login({ email: "test@example.com", password: "wrongPassword" }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("メール未認証のユーザーはUnauthorizedExceptionが投げられる", async () => {
      // 準備: isVerified が false のユーザー
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        isVerified: false,
      });

      await expect(
        service.login({ email: "test@example.com", password: "anyPassword" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("verifyEmail", () => {
    it("有効なトークンでメール認証が完了する", async () => {
      // 準備: トークンに一致するユーザーが見つかる
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: "user-1",
        email: "test@example.com",
        verificationToken: "valid-token",
      });
      mockPrismaService.user.update.mockResolvedValue({});

      // 実行
      const result = await service.verifyEmail("valid-token");

      // 検証
      expect(result.message).toBe("メール認証が完了しました");
      // updateが正しい引数で呼ばれたか確認
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { isVerified: true, verificationToken: null },
      });
    });

    it("無効なトークンの場合はBadRequestExceptionが投げられる", async () => {
      // 準備: トークンに一致するユーザーが見つからない
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.verifyEmail("invalid-token")).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getUserById", () => {
    it("ユーザーが存在する場合、ユーザー情報が返る", async () => {
      // 準備: ユーザーが存在する
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // 実行
      const result = await service.getUserById("user-1");

      // 検証
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
        include: { bankAccounts: true },
      });
    });

    it("ユーザーが存在しない場合、nullが返る", async () => {
      // 準備: ユーザーが存在しない
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById("user-1")).resolves.toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
        include: { bankAccounts: true },
      });
    });
  });

  describe("getLatestBankAccount", () => {
    it("ユーザーの最新の銀行口座情報が返る", async () => {
      // 準備: 銀行口座情報が存在する
      const mockBankAccount = {
        id: "account-1",
        userId: "user-1",
        bankName: "Test Bank",
        accountNumber: "12345678",
      };
      mockPrismaService.bankAccount.findFirst.mockResolvedValue(
        mockBankAccount,
      );

      // 実行
      const result = await service.getLatestBankAccount("user-1");

      // 検証
      expect(result).toEqual(mockBankAccount);
      expect(mockPrismaService.bankAccount.findFirst).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("銀行口座情報が存在しない場合、nullが返る", async () => {
      // 準備: 銀行口座情報が存在しない
      mockPrismaService.bankAccount.findFirst.mockResolvedValue(null);

      await expect(service.getLatestBankAccount("user-1")).resolves.toBeNull();
      expect(mockPrismaService.bankAccount.findFirst).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
    });
  });
});
