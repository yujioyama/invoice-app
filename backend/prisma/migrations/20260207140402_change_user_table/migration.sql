/*
  Warnings:

  - You are about to drop the column `branchAddress` on the `BankAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "branchAddress",
ADD COLUMN     "bankAccount" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "street" DROP NOT NULL;
