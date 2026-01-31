import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const { token, user } = await this.authService.register(dto);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ user });
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { token, user } = await this.authService.login(dto);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ user });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return { user: req.user };
  }
}
