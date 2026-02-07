import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (res.statusCode >= 400) {
        console.error(
          `[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
        );
      } else {
        console.log(
          `[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
        );
      }
    });
    next();
  }
}
