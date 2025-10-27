"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CartType } from "@/types/cart/cart.type";
import { Loader, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CartSummary({ cart }: { cart: CartType }) {
  //hooks
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="h4-bold">Cart Summary</CardTitle>
      </CardHeader>
      <CardContent>

        <div className="flex justify-between items-center ">
          <span>Items Price</span>
          <span>${cart.itemsPrice.toFixed(2)}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="default" className="w-full" disabled={isPending} onClick={() => startTransition(async () => {
          router.push("/checkout");
        })}> 
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
            Checkout
            </Button>
      </CardFooter>
    </Card>
  );
}