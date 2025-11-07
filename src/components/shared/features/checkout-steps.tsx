import { Badge } from "@/components/ui/badge";
import { CHECKOUT_STEPS, enCheckoutSteps } from "@/enums/checkout-steps-enum";
import React from "react";

export default function CheckoutSteps({
  currentStep,
}: {
  currentStep: enCheckoutSteps;
}) {
  return (
    
    <div className="hidden lg:flex lg:justify-center lg:items-center lg:gap-3 lg:w-full">
      {CHECKOUT_STEPS.map((step, index) => (
        <React.Fragment key={step}>
          <Badge
            variant="outline"
            className={`p-3 rounded-full text-sm ${
              index == currentStep
                ? "bg-primary text-primary-foreground shadow-lg"
                : index < currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground shadow-sm"
            }`}
          >
            {step}
          </Badge>

          {index < CHECKOUT_STEPS.length - 1 && (
            <hr
              className={`min-w-32 h-0.5 bg-border ${
                index < currentStep ? "bg-primary" : "bg-secondary"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
