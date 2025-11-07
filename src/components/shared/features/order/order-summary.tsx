"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CartType } from "@/types/cart/cart-type";
import { User } from "@/generated/prisma";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateOrderServerAction } from "@/lib/actions/orders/orders-actions";
import { toast } from "sonner";
import { Loader, ShoppingCart } from "lucide-react";

export default function OrderSummary({
  cart,
  user,
  canPlaceOrder
}: {
  cart: CartType;
  user: User;
  canPlaceOrder: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handlePlaceOrder = () => {
    startTransition(async () => {
      const response = await CreateOrderServerAction(user, cart);
      if (response.success) {
        toast.success(response.message);
        router.push("/orders/details/" + response.data);
      } else {
        toast.error(response.message);
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h4-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Items Price</span>
          <span>${cart?.itemsPrice?.toFixed(2) ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping Price</span>
          <span>${cart?.shippingPrice?.toFixed(2) ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Tax Price</span>
          <span>${cart?.taxPrice?.toFixed(2) ?? 0}</span>
        </div>
        <div className="flex justify-between items-center border-t pt-2">
          <span>Total Price</span>
          <span>${cart?.totalPrice?.toFixed(2) ?? 0}</span>
        </div>
      </CardContent>
      {canPlaceOrder && (
      <CardFooter>
        <Button
          variant="default"
          className="w-full"
          disabled={isPending}
          onClick={handlePlaceOrder}
        >
          {isPending ? (
            <>
            <Loader className="w-4 h-4 animate-spin" />
            Placing Order...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Place Order
            </>
          )}
        </Button>
      </CardFooter>
      )}
    </Card>
  );
}
