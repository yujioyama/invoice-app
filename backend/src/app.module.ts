import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { ClientsModule } from "./clients/clients.module";
import { AuthModule } from "./auth/auth.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { HttpExceptionLoggerFilter } from "./filters/http-exception-logger.filter";

@Module({
  imports: [PrismaModule, InvoicesModule, ClientsModule, AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
