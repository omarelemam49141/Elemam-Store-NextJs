# Cart Page Tests

## Purpose

Ensure the cart route toggles between empty and populated layouts based on the server action response.

## Covered scenarios

- Empty state renders when `GetCartAction` returns `data: null`.
- Populated carts render `CartItems` and `CartSummary` with the expected props.

## Implementation notes

- Tests reside in `src/app/(root)/cart/page.test.tsx`.
- `EmptyCart`, `CartItems`, and `CartSummary` are mocked to assert prop forwarding without exercising their internals.
- `GetCartAction` is mocked with `vi.mock` to supply deterministic responses.

## Future extensions

- Add error-state handling if the page ever renders a fallback for non-success responses.
- Consider accessibility checks (e.g., headings, list semantics) if the layout changes.

