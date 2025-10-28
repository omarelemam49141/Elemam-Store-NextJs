"use client";

import { CartItemType } from "@/types/cart/cart-item-type";
import Link from "next/link";
import Image from "next/image";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader, Minus, Plus } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { AddToCartServerAction, RemoveFromCartServerAction } from "@/lib/actions/cart/cart-actions";

export default function CartItemDetails({ cartItem }: { cartItem: CartItemType }) {
  //hooks
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <TableCell className="flex items-center gap-2">
        <Link href={`/products/${cartItem.slug}`}>
          <Image src={cartItem.image} alt={cartItem.name} width={64} height={64} />
        </Link>
        <span className="text-sm font-medium">{cartItem.name}</span>
      </TableCell>
      <TableCell>
        <p className="text-sm font-medium flex items-center gap-2">
          <Button variant="outline" disabled={cartItem.quantity <= 1 || isPending} onClick={() => startTransition(async () => {
            const response = await RemoveFromCartServerAction(cartItem.productId, cartItem.slug, cartItem.name);
            if (response.success) {
              toast.success(response.message);
            } else {
              toast.error(response.message);
            }
          })}>
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Minus />}
          </Button>
          {cartItem.quantity}
          <Button variant="outline" disabled={isPending} onClick={() => startTransition(async () => {
            const response = await AddToCartServerAction(cartItem);
            if (response.success) {
              toast.success(response.message);
            } else {
              toast.error(response.message);
            }
          })}>
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus />}
          </Button>
          </p>
      </TableCell>
      <TableCell>
        <p className="text-sm font-medium">${(cartItem.price * cartItem.quantity).toFixed(2)}</p>
      </TableCell>
    </>
  );
}