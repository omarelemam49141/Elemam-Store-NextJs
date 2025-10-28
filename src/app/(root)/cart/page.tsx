import { GetCartAction } from "@/lib/actions/cart/cart-actions";
import EmptyCart from "./components/empty-cart";
import CartItems from "./components/cart-items";
import { Metadata } from "next";
import CartSummary from "./components/cart-summary";

export const metadata: Metadata = {
  title: "Shopping Cart",
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
