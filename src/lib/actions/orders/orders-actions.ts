"use server";

import { prisma } from "@/lib/db/prisma";
import { getErrorResponse, getSuccessResponse } from "@/lib/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Prisma, User } from "@/generated/prisma";
import { ShippingAddressType } from "@/types/user/shipping-address-type";
import { CartItemType } from "@/types/cart/cart-item-type";
import { CartType } from "@/types/cart/cart-type";

// Define the type for order with included relations
type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
        include: {
            product: true,
        }
    }
    paymentMethod: true,
    user: true
  }
}>

export async function CreateOrderServerAction(user: User, cart: CartType) {
    try {
         const orderId = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                    shippingAddress: user.address as ShippingAddressType,
                    paymentMethodId: user.paymentMethodId as string,
                }
            })

            await tx.orderItem.createMany({
                data: (cart.items as CartItemType[]) .map((item: CartItemType) => ({
                    orderId: order.id,
                    productId: item.productId,
                    qty: item.quantity,
                    price: item.price,
                })),
            })

            return order.id;
        })

        return getSuccessResponse<string>("Order created successfully", orderId);
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return getErrorResponse<null>(error);
    }
}

export async function GetOrderDetailsAction(id: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    }
                },
                paymentMethod: true,
                user: true,

            },


        }) as OrderWithRelations | null
        if (!order) {
            console.log("Order not found");
            return getErrorResponse<null>("Order not found");
        }
        return getSuccessResponse("Order details", order);
    } catch (error) {
        console.log("Error getting order details", error);

        return getErrorResponse<null>(error);
    }
}