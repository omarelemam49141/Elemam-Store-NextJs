"use client";

import { Button } from "@/components/ui/button";
import {
  AddToCartServerAction,
  RemoveFromCartServerAction,
} from "@/lib/actions/cart/cart-actions";
import { CartItemType } from "@/types/cart/cart-item-type";
import { Loader, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const AddToCart = ({
  cartItem,
  productFromCart,
  stock,
}: {
  cartItem: CartItemType;
  productFromCart: CartItemType | undefined;
  stock: number;
}) => {
  //hooks
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //methods
  async function addItemToCart() {
    startTransition(async () => {
      const result = await AddToCartServerAction(cartItem);
      if (result.success) {
        toast("Success", {
          description: result.message,
          action: {
            label: "Go to cart",
            onClick: () => router.push("/cart"),
          },
        });
      } else {
        toast.error(result.message);
      }
    });
  }

  async function RemoveItemFromCartClient() {
    startTransition(async () => {
      const response = await RemoveFromCartServerAction(
        cartItem.productId,
        cartItem.slug,
        cartItem.name
      );
      if (response.success) {
        toast("Success", {
          description: `${cartItem.name} removed from cart successfully!`,
        });
      } else {
        toast.error(response.message);
      }
    });
  }

  //component
  return (
    <>
      {!productFromCart && (
        <Button className="w-full" onClick={addItemToCart} disabled={isPending}>
          {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus />}

          <span>Add to cart</span>
        </Button>
      )}

      {productFromCart && (
        <div className="flex justify-between items-center">
          <Button
            onClick={RemoveItemFromCartClient}
            variant={"outline"}
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Minus />
            )}
          </Button>
          <span>{productFromCart?.quantity}</span>
          <Button
            onClick={addItemToCart}
            variant={"outline"}
            disabled={stock == 0 || isPending}
          >
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus />}
          </Button>
        </div>
      )}
    </>
  );
};

export default AddToCart;
