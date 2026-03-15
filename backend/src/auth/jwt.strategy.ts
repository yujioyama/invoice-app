import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Pass options to the constructor of the parent class (PassportStrategy)
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.token; // CookieからJWT取得
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "dev_secret", // JWTの署名に使用する秘密鍵
    });
  }

  // called when a valid JWT is found, and its payload is passed as an argument
  async validate(payload: { sub: string; email: string; name: string }) {
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
