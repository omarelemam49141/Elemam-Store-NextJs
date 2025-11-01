/*
  Warnings:

  - You are about to drop the column `PaymentMethod` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "PaymentMethod",
ADD COLUMN     "paymentMethodId" UUID;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
