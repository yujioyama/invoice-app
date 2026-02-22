import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import cuid from "cuid";
// import nodemailer from "nodemailer";
import { Currency } from "@prisma/client";
import { Resend } from "resend";

function toCurrency(value: unknown): Currency {
  if (typeof value !== "string") return Currency.AUD;
  const normalized = value.trim().toUpperCase();
  return (Object.values(Currency) as string[]).includes(normalized)
    ? (normalized as Currency)
    : Currency.AUD;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateJwt(user: { id: string; email: string; name: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException("Email already registered");
    const hash = await bcrypt.hash(dto.password, 10);
    const verificationToken = cuid();
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hash,
        isVerified: false,
        verificationToken: verificationToken,
      },
      select: { id: true, email: true, name: true },
    });

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "onboarding@resend.dev", // 最初はこれでOK
        to: user.email,
        subject: "メールアドレス確認",
        text: `下記URLをクリックして認証してください: https://invoice-app-phi-lime.vercel.app/auth/verifyEmail?token=${verificationToken}`,
      });
    } catch (error) {
      console.error("MAIL_USER:", process.env.MAIL_USER);
      console.error("MAIL_PASS exists:", !!process.env.MAIL_PASS);
      console.error(error);
      try {
        await this.prisma.user.delete({ where: { id: user.id } });
      } catch (deleteError) {
        // ユーザーが存在しない場合は無視
        if ((deleteError as any).code !== "P2025") throw deleteError;
      }
      throw new Error("メール送信に失敗しました。再度お試しください。");
    }

    const jwtToken = this.generateJwt(user);
    return {
      token: jwtToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });
    if (!user) throw new BadRequestException("無効なトークンです");
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });
    return { message: "メール認証が完了しました" };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isVerified: true,
      },
    });
    if (!user?.isVerified) {
      throw new UnauthorizedException(
        "Your account has not been verified. Please check your email for the verification link.",
      );
    }
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");
    const jwtToken = this.generateJwt(user);
    return {
      token: jwtToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async getLatestBankAccount(userId: string) {
    return this.prisma.bankAccount.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        bankAccounts: true,
      },
    });
  }

  async updateUserDetails(
    userId: string,
    data: {
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      countryCode?: string | null;
      street?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      postalCode?: string | null;
      bankAccount?: {
        id?: string;
        bank?: string;
        accountName?: string;
        branchCode?: string;
        accountNumber?: string;
        swiftBic?: string;
        branchAddress?: string | null;
        currency?: string;
        intermediaryBank?: string | null;
      };
      bankAccounts?: unknown;
    },
  ) {
    const {
      bankAccount,
      firstName,
      lastName,
      phone,
      countryCode,
      street,
      city,
      state,
      country,
      postalCode,
    } = data;

    const userUpdateData: {
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      countryCode?: string | null;
      street?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      postalCode?: string | null;
    } = {};

    if (firstName !== undefined) userUpdateData.firstName = firstName;
    if (lastName !== undefined) userUpdateData.lastName = lastName;
    if (phone !== undefined) userUpdateData.phone = phone;
    if (countryCode !== undefined) userUpdateData.countryCode = countryCode;
    if (street !== undefined) userUpdateData.street = street;
    if (city !== undefined) userUpdateData.city = city;
    if (state !== undefined) userUpdateData.state = state;
    if (country !== undefined) userUpdateData.country = country;
    if (postalCode !== undefined) userUpdateData.postalCode = postalCode;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

    if (bankAccount) {
      const bankAccountId =
        typeof bankAccount.id === "string" && bankAccount.id.trim() !== ""
          ? bankAccount.id
          : null;

      if (bankAccountId) {
        await this.prisma.bankAccount.update({
          where: { id: bankAccountId },
          data: {
            bank: bankAccount.bank,
            accountName: bankAccount.accountName,
            branchCode: bankAccount.branchCode,
            accountNumber: bankAccount.accountNumber,
            swiftBic: bankAccount.swiftBic,
            branchAddress: bankAccount.branchAddress,
            currency: toCurrency(bankAccount.currency),
            intermediaryBank: bankAccount.intermediaryBank,
          },
        });
      } else {
        const missing: string[] = [];
        if (!bankAccount.bank) missing.push("bank");
        if (!bankAccount.accountName) missing.push("accountName");
        if (!bankAccount.branchCode) missing.push("branchCode");
        if (!bankAccount.accountNumber) missing.push("accountNumber");
        if (!bankAccount.swiftBic) missing.push("swiftBic");
        if (missing.length > 0) {
          throw new BadRequestException(
            `Missing required bankAccount fields: ${missing.join(", ")}`,
          );
        }

        await this.prisma.bankAccount.create({
          data: {
            user: { connect: { id: userId } },
            bank: bankAccount.bank,
            accountName: bankAccount.accountName,
            branchCode: bankAccount.branchCode,
            accountNumber: bankAccount.accountNumber,
            swiftBic: bankAccount.swiftBic,
            branchAddress: bankAccount.branchAddress,
            currency: toCurrency(bankAccount.currency),
            intermediaryBank: bankAccount.intermediaryBank,
          },
        });
      }
    }

    return updatedUser;
  }
}
