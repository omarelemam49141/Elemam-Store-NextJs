const userLogin = "User Login";
const shippingAddress = "Shipping Address";
const paymentMethod = "Payment Method";
const reviewOrder = "Review Order";

export const CHECKOUT_STEPS = [userLogin, shippingAddress, paymentMethod, reviewOrder];

export enum enCheckoutSteps {
  eUserLogin = CHECKOUT_STEPS.indexOf(userLogin),
  eShippingAddress = CHECKOUT_STEPS.indexOf(shippingAddress),
  ePaymentMethod = CHECKOUT_STEPS.indexOf(paymentMethod),
  eReviewOrder = CHECKOUT_STEPS.indexOf(reviewOrder),
}