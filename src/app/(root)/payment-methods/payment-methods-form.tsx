"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserPaymentMethodServerAction } from "@/lib/actions/user/user-actions";
import { PaymentMethodType } from "@/types/payment-methods/payment-method-type";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

function PaymentMethodsForm({paymentMethods, userPaymentMethodId}: {paymentMethods: PaymentMethodType[], userPaymentMethodId?: string | null}) {
  const [actionState, action, isPending] = useActionState(updateUserPaymentMethodServerAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (actionState.message) {
      if (actionState.success) {
        toast.success(actionState.message)
        redirect("/review-order")
      } else {
        toast.error(actionState.message)
      }
    }
  }, [actionState])
  
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action}>
                    <div className="flex flex-col gap-4 ">
                        <div className="flex flex-col gap-2">
                            <Label className="mb-3">Select your payment method</Label>
                            <Select defaultValue={userPaymentMethodId ?? undefined} name="paymentMethodId">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map((paymentMethod) => (
                                        <SelectItem key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <Button type="submit" disabled={isPending} className="mt-5">
                        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Update Payment Method"}
                    </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
  )
}

export default PaymentMethodsForm