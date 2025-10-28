import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import ShippingAddressForm from "./components/shipping-address-form";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/features/checkout-steps";
import { enCheckoutSteps } from "@/enums/checkout-steps-enum";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShippingAddressPage() {
  //getting user from database
  const session = await auth();
  const queryParams = new URLSearchParams();
  queryParams.set("callbackUrl", "/shipping-address");
  // If no session, redirect immediately
  if (!session) {
    redirect("/sign-in?" + queryParams.toString());
  }
  
  const userId = session.user?.id;
  
  // If no user ID in session, redirect immediately
  if (!userId) {
    redirect("/sign-in?" + queryParams.toString());
  }
  
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    redirect("/sign-in?" + queryParams.toString());
  }

  return (
    <div>
      <div className="mb-10">
      <CheckoutSteps currentStep={enCheckoutSteps.eShippingAddress}  />
      </div>
      <ShippingAddressForm user={user} />
    </div>
  );
}