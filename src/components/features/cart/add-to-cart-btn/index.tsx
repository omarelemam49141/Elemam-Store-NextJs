"use client";

import { Button } from "@/components/ui/button";
import { AddToCartServerAction } from "@/lib/actions/cart/cart.actions";
import { CartItemType } from "@/types/cart/cart-item.type";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

const AddToCart = ({ cartItem }: { cartItem: CartItemType }) => {
  //hooks
  const router = useRouter();

  //methods
  async function addItemToCart(cartItem: CartItemType) {
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
  }

  //component
  return (
    <>
      <Button className="w-full" onClick={() => addItemToCart(cartItem)}>
        <Plus />
        <span>Add to cart</span>
      </Button>
    </>
  );
};

export default AddToCart;
