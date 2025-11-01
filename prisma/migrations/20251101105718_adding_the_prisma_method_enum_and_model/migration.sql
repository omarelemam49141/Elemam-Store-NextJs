-- CreateEnum
CREATE TYPE "enPaymentMethodType" AS ENUM ('Stripe', 'PayPal', 'CashOnDelivery');

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "enPaymentMethodType" NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);
