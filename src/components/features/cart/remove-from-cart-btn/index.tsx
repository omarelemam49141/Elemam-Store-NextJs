"use client";

import { Button } from "@/components/ui/button";
import { RemoveFromCartServerAction } from "@/lib/actions/cart/cart.actions";
import { Trash } from "lucide-react";
import { toast } from "sonner";

const RemoveItemFromCart = ({
  cartItem,
}: {
  cartItem: {
    productId: string;
    name: string;
    slug: string;
  };
}) => {
  async function RemoveItemFromCartClient() {
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
  }

  return (
    <Button variant="destructive" onClick={() => RemoveItemFromCartClient()}>
      <Trash /> Remove from cart
    </Button>
  );
};

export default RemoveItemFromCart;
