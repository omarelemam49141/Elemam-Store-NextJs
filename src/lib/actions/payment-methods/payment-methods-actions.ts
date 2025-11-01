"use server";

import { prisma } from "@/lib/db/prisma";
import { getErrorResponse } from "@/lib/utils";
import { PaymentMethodType } from "@/types/payment-methods/payment-method-type";
import { GenericResponse } from "@/types/shared/generic-response-type";

export async function GetPaymentMethodsAction(): Promise<
  GenericResponse<PaymentMethodType[]>
> {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        isAvailable: true,
      },
    });
    return {
      success: true,
      message: "Payment methods fetched successfully",
      data: paymentMethods,
    };
  } catch (error) {
    return getErrorResponse<PaymentMethodType[]>(error);
  }
}

export async function UpdatePaymentMethodAvailabilityAction(
  paymentMethodId: string,
  isAvailable: boolean
): Promise<GenericResponse<PaymentMethodType>> {
  try {
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isAvailable },
    });
    return {
      success: true,
      message: "Payment method availability updated successfully",
      data: paymentMethod,
    };
  } catch (error) {
    return getErrorResponse<PaymentMethodType>(error);
  }
}
