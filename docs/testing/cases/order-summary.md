# Order Summary Component Tests

## Purpose

Validate checkout confirmation logic, ensuring successful orders navigate to the details page while errors surface actionable feedback.

## Covered scenarios

- CTA hidden when `canPlaceOrder` is false.
- Successful submissions call `CreateOrderServerAction`, show a success toast, and navigate to `/orders/details/:id`.
- Failures trigger `toast.error` without navigation.

## Implementation notes

- Implementation located at `src/components/shared/features/order/order-summary.test.tsx`.
- Server action mocked to return deterministic success/failure payloads.
- Router transitions are asserted via the mocked `useRouter().push`.

## Future extensions

- Add tests for price formatting if business rules change (e.g., currency localization).
- Validate loading state text (“Placing Order…”) once accessible labeling is added.

