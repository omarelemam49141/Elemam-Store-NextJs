"use server";

import { auth } from "@/auth";
import { CART_ID_SESSION } from "@/lib/constants";
import { CartItemType } from "@/types/cart/cart-item.type";
import { GenericResponse } from "@/types/shared/generic-response.type";
import { CartItem } from "@/validations/cart/cart-item.validation";
import { cookies } from "next/headers";
import { prisma } from "../../../../db/prisma";
import { FixedRound2, getErrorResponse } from "@/lib/utils";

function CalculateCartPrices(cartItems: CartItemType[]): {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
} {
  const itemsPrice = cartItems.reduce(
    (acc, curr) => FixedRound2(curr.price),
    0
  );
  const shippingPrice = +(itemsPrice > 100 ? 0 : 10).toFixed(2);
  const taxPrice = FixedRound2(itemsPrice * 0.15);
  const totalPrice = taxPrice + shippingPrice + itemsPrice;

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}

export async function AddToCartServerAction(
  cartItem: CartItemType
): Promise<GenericResponse<null>> {
  try {
    //validate the cartItem
    const cartItemValidated = CartItem.parse(cartItem);

    //Get the cartSessionId
    const cartSessionId = (await cookies()).get(CART_ID_SESSION)?.value;

    //if the cartSessionId is null throw error
    if (!cartSessionId) {
      throw new Error("Cart session id can't be null");
    }

    //get the user id
    const session = await auth();
    const userId = session?.user?.id;

    //get product from database
    const productFromDB = prisma.product.findFirst({
      where: { id: cartItemValidated.productId },
    });

    //check if product exists
    if (!productFromDB) {
      throw new Error(`Product ${cartItemValidated.name} not found`);
    }

    //get the cart from the database
    const cart = await prisma.cart.findFirst({
      where: {
        OR: [{ userId: userId }, { sessionCartId: cartSessionId }],
      },
    });

    //if the cart doesn't exist then create new one
    if (!cart) {
      await prisma.cart.create({
        data: {
          sessionCartId: cartSessionId,
          userId: userId,
          items: [cartItemValidated],
          ...CalculateCartPrices([cartItemValidated]),
        },
      });
    }

    //return success response
    const response: GenericResponse<null> = {
      success: true,
      message: `${cartItem.name} has been added successfully!`,
    };

    return response;
  } catch (error) {
    return getErrorResponse<null>(error);
  }
}
