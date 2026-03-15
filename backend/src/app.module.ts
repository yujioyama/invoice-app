import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { ClientsModule } from "./clients/clients.module";
import { AuthModule } from "./auth/auth.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60秒間
        limit: 5, // 最大5回
      },
    ]),
    PrismaModule,
    InvoicesModule,
    ClientsModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
