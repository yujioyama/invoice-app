import {
  Query,
  Body,
  Controller,
  Post,
  Res,
  Get,
  Patch,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const { token, user } = await this.authService.register(dto);
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.json({ user });
  }

  @Get("verifyEmail")
  async verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { token, user } = await this.authService.login(dto);
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.json({ user });
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("token", COOKIE_OPTIONS);
    return res.json({ message: "Logged out" });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req) {
    return { user: req.user };
  }

  @Get("me/details")
  @UseGuards(JwtAuthGuard)
  async getMyDetails(@Request() req) {
    const user = await this.authService.getUserById(req.user.id);
    return { user };
  }

  @Patch("me/details")
  @UseGuards(JwtAuthGuard)
  async updateMyDetails(@Request() req, @Body() data: any) {
    const updatedUser = await this.authService.updateUserDetails(
      req.user.id,
      data,
    );
    return { user: updatedUser };
  }
}
