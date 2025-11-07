import { GetCartAction } from "@/lib/actions/cart/cart-actions";
import EmptyCart from "./components/empty-cart";
import CartItems from "./components/cart-items";
import { Metadata } from "next";
import CartSummary from "./components/cart-summary";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review the products in your shopping cart, update quantities, or proceed to checkout when you're ready.",
  alternates: {
    canonical: "/cart",
  },
  openGraph: {
    title: `${APP_NAME} | Shopping Cart`,
    description: "Keep track of the items you've added, adjust your cart, and move forward to shipping and payment.",
    url: "/cart",
    type: "website",
  },
};

const CartPage = async () => {
  let isCartEmpty = false;
  const cartResponse = await GetCartAction();
  if (cartResponse.success && (cartResponse.data === null || cartResponse.data?.items.length == 0)) {
    isCartEmpty = true;
  }

  return (
    <>
      <h1 className="h2-bold">Shopping Cart</h1>
      {isCartEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-4">
          <div className="lg:col-span-3">
            <CartItems cartItems={cartResponse.data?.items || []} />
          </div>

          {cartResponse.data && (
          <div className="lg:col-span-1">
            <CartSummary cart={cartResponse.data} />
          </div>
          )}
        </div>
      )}
    </>
  );
};

export default CartPage;
