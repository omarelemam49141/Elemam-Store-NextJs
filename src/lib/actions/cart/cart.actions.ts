"use server";

import { CartItemType } from "@/types/cart/cart-item.type";
import { GenericResponse } from "@/types/shared/generic-response.type";

export async function AddToCartServerAction(
  cartItem: CartItemType
): Promise<GenericResponse<null>> {
  const response: GenericResponse<null> = {
    success: true,
    message: `${cartItem.name} has been added successfully!`,
  };

  return response;
}
