"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getErrorResponse } from "@/lib/utils";
import { GenericResponse } from "@/types/shared/generic-response-type";
import { ShippingAddressType } from "@/types/user/shipping-address-type";
import { shippingAddressValidation } from "@/validations/user/shipping-address-validation";
import { revalidatePath } from "next/cache";


export async function updateShippingAddressServerAction(data: ShippingAddressType): Promise<GenericResponse<null>> {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) {
            throw new Error("User id not found");
        }

        const user = await prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const parsedData = shippingAddressValidation.parse(data);

        await prisma.user.update({
            where: { id: userId },
            data: { address: parsedData },
        });
        const response: GenericResponse<null> = {
            success: true,
            message: "Shipping address updated successfully",
        };
        revalidatePath("/shipping-address");
        return response;
    } catch (error) {
        return getErrorResponse<null>(error);
    }
}