import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [PrismaModule, InvoicesModule, AuthModule],
})
export class AppModule {}
