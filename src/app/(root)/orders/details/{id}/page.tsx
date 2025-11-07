import CartItemsSummary from "@/components/shared/features/order/cart-items-summary";
import OrderSummary from "@/components/shared/features/order/order-summary";
import PaymentMethodSummary from "@/components/shared/features/order/payment-method-summary";
import ShippingAddressSummary from "@/components/shared/features/order/shipping-address-summary";
import { User } from "@/generated/prisma";
import { GetOrderDetailsAction } from "@/lib/actions/orders/orders-actions";
import { CartItemType } from "@/types/cart/cart-item-type";
import { CartType } from "@/types/cart/cart-type";
import { PaymentMethodType } from "@/types/payment-methods/payment-method-type";
import { ShippingAddressType } from "@/types/user/shipping-address-type";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderDetailsResponse = await GetOrderDetailsAction(id);
  if (!orderDetailsResponse.success) {
    return notFound();
  }
  const orderDetails = orderDetailsResponse.data;
  const cartItemsInOrder = orderDetails?.orderItems.map((orderItem) => ({
    productId: orderItem.productId,
    name: orderItem.product.name,
    slug: orderItem.product.slug,
    quantity: orderItem.qty,
    price: orderItem.price.toNumber(),
    image: orderItem.product.images[0],
  })) as CartItemType[];
  const cartFromOrder = {
    items: cartItemsInOrder,
    itemsPrice: orderDetails?.itemsPrice.toNumber(),
    shippingPrice: orderDetails?.shippingPrice.toNumber(),
    taxPrice: orderDetails?.taxPrice.toNumber(),
    totalPrice: orderDetails?.totalPrice.toNumber(),
  } as CartType;
  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-10">
      <div className="lg:col-span-3">
        <div className="mb-5">
          <ShippingAddressSummary
            shippingAddress={orderDetails?.shippingAddress as ShippingAddressType}
            canEdit={false}
          />
        </div>
        <div className="mb-5">
          <PaymentMethodSummary
            paymentMethod={orderDetails?.paymentMethod as PaymentMethodType}
            canEdit={false}
          />
        </div>
        <div className="mb-10">
          <CartItemsSummary cartItems={cartItemsInOrder} />
        </div>
      </div>

      <div className="lg:col-span-1">
        <OrderSummary cart={cartFromOrder} user={orderDetails?.user as User} />
      </div>
    </div>
  </>
  );
}