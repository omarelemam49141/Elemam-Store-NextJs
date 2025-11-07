import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/features/checkout-steps";
import CartItemsSummary from "@/components/shared/features/order/cart-items-summary";
import OrderSummary from "@/components/shared/features/order/order-summary";
import PaymentMethodSummary from "@/components/shared/features/order/payment-method-summary";
import ShippingAddressSummary from "@/components/shared/features/order/shipping-address-summary";
import { enCheckoutSteps } from "@/enums/checkout-steps-enum";
import { GetCartAction } from "@/lib/actions/cart/cart-actions";
import { prisma } from "@/lib/db/prisma";
import { CartItemType } from "@/types/cart/cart-item-type";
import { CartType } from "@/types/cart/cart-type";
import { PaymentMethodType } from "@/types/payment-methods/payment-method-type";
import { ShippingAddressType } from "@/types/user/shipping-address-type";
import { redirect } from "next/navigation";

export default async function PlaceOrderPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const cartResponse = await GetCartAction();
  let cart = null;
  if (!cartResponse.success) {
    redirect("/cart");
  } else {
    cart = cartResponse.data;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      paymentMethod: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.address) {
    redirect("/shipping-address");
  }
 
  if (!cart) {
    redirect("/cart");
  }
  if (!user.paymentMethod) {
    redirect("/payment-methods");
  }

  return (
    <>
      <CheckoutSteps currentStep={enCheckoutSteps.ePlaceOrder} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-10">
        <div className="lg:col-span-3">
          <div className="mb-5">
            <ShippingAddressSummary
              shippingAddress={user.address as ShippingAddressType}
              canEdit={true}
            />
          </div>
          <div className="mb-5">
            <PaymentMethodSummary
              paymentMethod={user.paymentMethod as PaymentMethodType}
              canEdit={true}
            />
          </div>
          <div className="mb-10">
            <CartItemsSummary cartItems={cart.items as CartItemType[]} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary cart={cart} user={user} />
        </div>
      </div>
    </>
  );
}
