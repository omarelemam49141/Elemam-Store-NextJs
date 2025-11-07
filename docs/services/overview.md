# Services & Server Actions Overview

This document outlines the primary backend entry points exposed to the UI.

## Products

- **Server actions:** `GetProductsPaginatedAction`, `GetProductBySlugAction` (`src/lib/actions/products/products-actions.ts`).
- **Service layer:** `src/services/products/products-service.ts` encapsulates Prisma queries.
- **Validations:** Product filters currently rely on typed inputs; add Zod schemas to `src/validations/products` when advanced filtering is added.
- **Tests:**
  - `page.test.tsx` covers newest arrival usage.
  - `product-images.test.tsx` & `add-to-cart-btn.test.tsx` exercise downstream UI behavior.

## Cart

- **Server actions:** `src/lib/actions/cart/cart-actions.ts` handles add/remove, cart retrieval, migrations, and cleanup.
- **Types:** Located in `src/types/cart/` and derived from Zod schemas in `src/validations/cart`.
- **Tests:** `add-to-cart-btn.test.tsx` validates client interactions; add dedicated tests when cart totals logic changes.

## Checkout / Orders

- **Server actions:** `CreateOrderServerAction`, `GetOrderDetailsAction` (`src/lib/actions/orders/orders-actions.ts`).
- **Services:** Queries executed directly through Prisma; extend with service wrappers when business logic grows.
- **Tests:** `order-summary.test.tsx` covers order placement; order details still rely on manual QA until new features arrive.

## Payment methods

- **Server actions:** `GetPaymentMethodsAction` (`src/lib/actions/payment-methods/payment-methods-actions.ts`).
- **Dependencies:** Prisma `PaymentMethod` model with enum `enPaymentMethodType`.
- **Next steps:** Add tests when client components gain complex branching (e.g., availability states).

## Users & Shipping

- **Server actions:** `src/lib/actions/user/user-actions.ts` plus shipping/cart actions above.
- **Validations:** Zod schemas housed in `src/validations/user/`.
- **Recommendations:** Add integration tests for address updates once form behaviour stabilises.

## Shared utilities

- `src/lib/utils.ts` provides helpers (`toNumeric`, `getSuccessResponse`, etc.).
- `src/lib/db/prisma.ts` centralises Prisma client configuration, including Decimal normalization. Update docs/tests whenever query extensions change.

## Testing alignment

- New services should include corresponding docs under `docs/testing/cases/` and coverage in Vitest.
- When adding server actions, ensure they return `GenericResponse` payloads and update this overview to keep documentation in sync.

