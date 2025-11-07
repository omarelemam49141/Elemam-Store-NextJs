# UI Overview

This guide summarises the key customer-facing flows and their dependencies.

## Home (Newest Arrivals)

- **Location:** `src/app/(root)/page.tsx`
- **Data source:** `GetProductsPaginatedAction` (newest products, server action).
- **Key components:** `ProductsList`, `ProductDetails` cards.
- **Testing:** `page.test.tsx` ensures the heading renders and handles empty feeds gracefully.
- **Notes:** Extendable to pagination; ensure new filters expose deterministic mocks in tests.

## Product Details

- **Location:** `src/app/(root)/products/[slug]/page.tsx`
- **Data source:** `GetProductBySlugAction`; optional cart checks via `GetProductFromCart`.
- **Key components:** `ProductImages`, `AddToCart`, `ProductPrice`.
- **Testing:**
  - `product-images.test.tsx` validates gallery interactions.
  - `add-to-cart-btn.test.tsx` verifies cart mutations and messaging.
- **Notes:** When adding reviews or availability logic, extend test cases accordingly.

## Cart

- **Location:** `src/app/(root)/cart/page.tsx`
- **Data source:** `GetCartAction` for user/session carts.
- **Key components:** `CartItems`, `CartItemDetails`, `CartSummary`.
- **Testing:** `add-to-cart-btn.test.tsx` covers adding/removing items; add cart page tests when totals logic evolves.
- **Notes:** Ensure loaders remain consistent via `src/app/(root)/cart/loading.tsx`.

## Checkout (Shipping → Payment → Review)

- **Locations:**
  - Shipping address form: `src/app/(root)/shipping-address/page.tsx`.
  - Payment methods: `src/app/(root)/payment-methods/page.tsx`.
  - Order review: `src/app/(root)/place-order/page.tsx`.
- **Data sources:** Prisma `user`, `paymentMethod`, and cart server actions.
- **Key components:**
  - `CheckoutSteps` indicator.
  - `OrderSummary`, `ShippingAddressSummary`, `PaymentMethodSummary`.
- **Testing:**
  - `checkout-steps.test.tsx` verifies progress styling.
  - `order-summary.test.tsx` covers place-order submission flows.
- **Notes:** When server actions gain additional validation, add tests for new failure states and update docs in `docs/testing/cases/`.

## Order Details

- **Location:** `src/app/(root)/orders/details/[id]/page.tsx`
- **Data source:** `GetOrderDetailsAction` with nested relations.
- **Key components:** Shared summaries + `CartItemsSummary`.
- **Testing:** Pending; add when order detail interactions (e.g., re-order) are introduced.

## Shared loaders

- **Location:** `src/components/shared/loading/loading-state.tsx` and route-level `loading.tsx` files.
- **Purpose:** Provide a consistent experience across navigation boundaries; update tests when adding skeletons or dynamic loading cues.

