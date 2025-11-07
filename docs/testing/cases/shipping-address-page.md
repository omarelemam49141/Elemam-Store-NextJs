# Shipping Address Page Tests

## Purpose

Verify the shipping step enforces authentication and renders the form when prerequisites are met.

## Covered scenarios

- Redirects to sign-in when no session or user id is present.
- Redirects when the user lookup fails.
- Renders checkout steps and the shipping form when the user exists.

## Implementation notes

- Tests are located at `src/app/(root)/shipping-address/page.test.tsx`.
- `auth`, Prisma `prisma.user.findFirst`, and `redirect` are mocked to control flow and capture redirect destinations.
- `CheckoutSteps` and the form component are shallow-mocked so assertions can verify the props they receive.

## Future extensions

- Add tests for pre-populating the form or validation feedback if the form becomes interactive on mount.

