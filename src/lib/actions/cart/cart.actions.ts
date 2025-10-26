"use server";
import { CartItem } from "./../../../validations/cart/cart-item.validation";

import { auth } from "@/auth";
import { CART_ID_SESSION } from "@/lib/constants";
import { CartItemType } from "@/types/cart/cart-item.type";
import { GenericResponse } from "@/types/shared/generic-response.type";
import { cookies } from "next/headers";
import { prisma } from "../../../../db/prisma";
import { FixedRound2, getErrorResponse } from "@/lib/utils";
import { revalidatePath } from "next/cache";

function CalculateCartPrices(cartItems: CartItemType[]): {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
} {
  const itemsPrice = cartItems.reduce(
    (acc, curr) => acc + FixedRound2(curr.price) * curr.quantity,
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
    cartItem.price = FixedRound2(cartItem.price);
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
    const productFromDB = await prisma.product.findFirst({
      where: { id: cartItemValidated.productId },
    });

    //check if product exists
    if (!productFromDB) {
      throw new Error(`Product ${cartItemValidated.name} not found`);
    }

    if (productFromDB.stock < 1) {
      throw new Error("Stock is not enough");
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
    } else {
      //if the product exists then add the quantity by one and recalculate the cart price
      const productExistingIndex = cart.items.findIndex(
        (item) =>
          (item as CartItemType).productId == cartItemValidated.productId
      );
      if (productExistingIndex != -1) {
        (cart.items[productExistingIndex] as CartItemType).quantity++;
      } else {
        //if the product doesn't exist then add it to the cart items array
        cart.items.push(cartItemValidated);
      }

      const updatedCartItems = cart.items as CartItemType[];
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: updatedCartItems,
          ...CalculateCartPrices(updatedCartItems),
        },
      });
    }

    //decrease the product stock by 1 and update it in the db
    await prisma.product.update({
      where: { id: productFromDB.id },
      data: { stock: productFromDB.stock - 1 },
    });

    //return success response
    const response: GenericResponse<null> = {
      success: true,
      message: `${cartItem.name} has been added successfully!`,
    };

    revalidatePath(`/products/${cartItem.slug}`);

    return response;
  } catch (error) {
    return getErrorResponse<null>(error);
  }
}

export async function RemoveFromCartServerAction(
  cartItemId: string,
  cartItemSlug: string,
  cartItemName: string
): Promise<GenericResponse<null>> {
  try {
    //get product from db
    const productFromDB = await prisma.product.findFirst({
      where: { id: cartItemId },
    });

    if (!productFromDB) {
      throw new Error("Product doesn't exist in DB");
    }

    //get the cart session id
    const cartSessionId = (await cookies()).get(CART_ID_SESSION)?.value;

    //get the user id
    const session = await auth();
    const userId = session?.user?.id;

    //get the cart from database
    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            userId: userId,
          },
          {
            sessionCartId: cartSessionId,
          },
        ],
      },
    });

    //throw error if cart doesn't exist
    if (!userCart) {
      throw new Error("Cart doesn't exist");
    }

    //get item from the cart
    const itemFromCartIndex = userCart.items.findIndex(
      (cartItem) => (cartItem as CartItemType).productId === cartItemId
    );

    //throw error if item doesn't exist in the cart
    if (itemFromCartIndex == -1) {
      throw new Error("Item doesn't exist in your cart");
    }

    //get product quantity in the cart
    const productQuantityInCart = (
      userCart.items[itemFromCartIndex] as CartItemType
    ).quantity;

    //remove item from the cart or decrease its quantity by 1
    if (productQuantityInCart == 1) {
      userCart.items.splice(itemFromCartIndex, 1);
    } else {
      (userCart.items[itemFromCartIndex] as CartItemType).quantity =
        productQuantityInCart - 1;
    }

    //calculate cart new prices
    const newCartPrices = CalculateCartPrices(userCart.items as CartItemType[]);

    //update the cart in the database
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        items: userCart.items as CartItemType[],
        ...newCartPrices,
      },
    });

    //update product quantity in DB
    await prisma.product.update({
      where: { id: cartItemId },
      data: { stock: productFromDB.stock + productQuantityInCart },
    });

    //return success response
    const response: GenericResponse<null> = {
      success: true,
      message: `${cartItemName} has been deleted successfully!`,
    };

    revalidatePath(`/products/${cartItemSlug}`);

    return response;
  } catch (error) {
    return getErrorResponse<null>(error);
  }
}

export async function GetProductFromCart(
  productId: string
): Promise<CartItemType | undefined> {
  try {
    //get the cart session id
    const cartSessionId = (await cookies()).get(CART_ID_SESSION)?.value;

    //get the user id
    const session = await auth();
    const userId = session?.user?.id;

    //get the cart from database
    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            userId: userId,
          },
          {
            sessionCartId: cartSessionId,
          },
        ],
      },
    });

    //throw error if cart doesn't exist
    if (!userCart) {
      throw new Error("Cart doesn't exist");
    }

    //get item from the cart
    const itemFromCart = userCart.items.find(
      (cartItem) => (cartItem as CartItemType).productId === productId
    );

    return itemFromCart as CartItemType;
  } catch (error) {
    return undefined;
  }
}

export async function DoesItemExistInCart(
  cartItemId: string
): Promise<boolean> {
  //get the cart session id
  const cartSessionId = (await cookies()).get(CART_ID_SESSION)?.value;

  //get the user id
  const session = await auth();
  const userId = session?.user?.id;

  //get the cart from database
  const userCart = await prisma.cart.findFirst({
    where: {
      OR: [
        {
          userId: userId,
        },
        {
          sessionCartId: cartSessionId,
        },
      ],
    },
  });

  //throw error if cart doesn't exist
  if (!userCart) {
    return false;
  }

  //get item from the cart
  const itemFromCartIndex = userCart.items.findIndex(
    (cartItem) => (cartItem as CartItemType).productId === cartItemId
  );

  return itemFromCartIndex != -1;
}
