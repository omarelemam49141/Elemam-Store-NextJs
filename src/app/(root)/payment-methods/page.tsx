import type { Metadata } from "next";
import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/features/checkout-steps";
import { enCheckoutSteps } from "@/enums/checkout-steps-enum";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import PaymentMethodsForm from "./payment-methods-form";
import { GetPaymentMethodsAction } from "@/lib/actions/payment-methods/payment-methods-actions";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Payment Methods",
  description: "Select the payment option that works best for you before placing your order securely.",
  alternates: {
    canonical: "/payment-methods",
  },
  openGraph: {
    title: `${APP_NAME} | Payment Methods`,
    description: "Review available payment methods and set your preferred option for checkout.",
    url: "/payment-methods",
    type: "website",
  },
};

export default async function PaymentMethodsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const paymentMethodsResponse = await GetPaymentMethodsAction();
  if (!paymentMethodsResponse.success) {
    return (
      <div>
        <h1>Error</h1>
        <p>{paymentMethodsResponse.message}</p>
      </div>
    )
  }
  const paymentMethods = paymentMethodsResponse.data;
  if (!paymentMethods || paymentMethods.length == 0) {
    return (
      <div>
        <h1>Error</h1>
        <p>No payment methods found</p>
      </div>
    )
  }


    return (
        <div>
      <div className="mb-10">
      <CheckoutSteps currentStep={enCheckoutSteps.ePaymentMethod}  />
      </div>
      <PaymentMethodsForm paymentMethods={paymentMethods} userPaymentMethodId={user.paymentMethodId} />
    </div>
    )
}