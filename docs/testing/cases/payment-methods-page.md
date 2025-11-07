# Payment Methods Page Tests

## Purpose

Confirm the payment step enforces authentication, handles error states, and renders the form when methods exist.

## Covered scenarios

- Redirects unauthenticated sessions or missing user records to sign-in.
- Displays error messaging when `GetPaymentMethodsAction` fails or returns an empty list.
- Renders checkout steps and `PaymentMethodsForm` when methods are available.

## Implementation notes

- Tests live in `src/app/(root)/payment-methods/page.test.tsx`.
- `auth`, Prisma user lookup, `redirect`, and the payment-method server action are mocked.
- UI dependencies (`CheckoutSteps`, `PaymentMethodsForm`) are shallow-mocked so props can be asserted.

## Future extensions

- Add coverage for optimistic updates once the form mutates user payment methods inline.

