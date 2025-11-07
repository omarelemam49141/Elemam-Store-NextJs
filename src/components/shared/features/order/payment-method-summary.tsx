import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethodType } from "@/types/payment-methods/payment-method-type";
import { CreditCard, Pencil } from "lucide-react";
import Link from "next/link";

export default function PaymentMethodSummary({ paymentMethod, canEdit }: { paymentMethod: PaymentMethodType, canEdit: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start gap-2"><CreditCard className="w-4 h-4" /> Payment Method Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
            <span className="font-medium">Payment Method</span>
            <span>{paymentMethod.name}</span>
        </div>
      </CardContent>
      {canEdit && (
        <CardFooter>
            <Button asChild variant="outline" className="w-fit">
                <Link href="/payment-methods">
                    <Pencil className="w-4 h-4" /> Edit Payment Method
                </Link>
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}