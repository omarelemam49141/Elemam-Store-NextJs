/*
  Warnings:

  - Added the required column `name` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "name" TEXT NOT NULL;
