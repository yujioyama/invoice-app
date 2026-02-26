-- CreateEnum
CREATE TYPE "InvoiceLanguage" AS ENUM ('en', 'ja');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "language" "InvoiceLanguage" NOT NULL DEFAULT 'en';
