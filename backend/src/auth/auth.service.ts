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
import nodemailer from "nodemailer";

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

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "メールアドレス確認",
      text: `下記URLをクリックして認証してください: http://localhost:3000/auth/verifyEmail?token=${verificationToken}`,
    });

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
}
