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

const isProduction = process.env.NODE_ENV === "production";

// COOKIE_OPTIONS: settings for authentication token cookie
const COOKIE_OPTIONS = {
  // Cookie cannot be accessed via JavaScript (protects against XSS attacks)
  httpOnly: true,
  // Cookie is sent only over HTTPS in production (protects against interception)
  secure: isProduction,
  // "none" allows cross-site cookie sending (required for frontend/backend on different domains, must be used with secure: true)
  // "lax" restricts cookie sending to same-site or safe cross-site requests (better for local development)
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  // Cookie expiration time in milliseconds (here: 7 days)
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
