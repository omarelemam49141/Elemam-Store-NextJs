import { enPaymentMethodType } from "@/generated/prisma";
import z from "zod";

export const PaymentMethodValidation = z.object({
  type: z.enum(enPaymentMethodType, `Type of payment method can only be ${Object.values(enPaymentMethodType).join(", ")}`),
  isAvailable: z.boolean(),
  name: z.string().min(1, "Name is required"),
});