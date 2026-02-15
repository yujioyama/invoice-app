-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('JPY', 'USD', 'EUR', 'GBP', 'AUD');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'JPY';
