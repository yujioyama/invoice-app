import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.token; // CookieからJWT取得
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "dev_secret",
    });
  }

  async validate(payload: { sub: string; email: string; name: string }) {
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
