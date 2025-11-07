# Add To Cart Component Tests

## Purpose

Guarantee the shopping cart CTA updates backend state correctly, surfaces success/error feedback, and respects stock limits.

## Covered scenarios

- Clicking the primary “Add to cart” button invokes `AddToCartServerAction` and surfaces a success toast.
- Decrement button calls `RemoveFromCartServerAction` with the right identifiers when the item already exists in the cart.
- Increment button becomes disabled when `stock` is `0` to prevent overselling.

## Implementation notes

- Tests live in `src/components/features/cart/add-to-cart-btn/add-to-cart-btn.test.tsx`.
- Server actions are mocked via `vi.mock('@/lib/actions/cart/cart-actions')`, while router navigation and Sonner toasts are mocked to keep assertions isolated.
- `renderWithProviders` wraps the component so future provider changes cascade naturally into tests.

## Future extensions

- Add coverage for failure branches (e.g. `toast.error`) to ensure messaging surfaces correctly.
- Mock multiple rapid increments to assert race conditions while `useTransition` is pending.

