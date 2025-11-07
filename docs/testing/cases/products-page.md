# Product Details Page Tests

## Purpose

Validate the product detail route renders server-fetched data and wires the add-to-cart flow correctly.

## Covered scenarios

- Renders product info when `GetProductBySlugAction` returns data and forwards props to the `AddToCart` client component.
- Invokes `notFound()` when the product lookup fails.
- Generates metadata for existing products and the not-found fallback.

## Implementation notes

- Tests live in `src/tests/app/(root)/products/[slug]/page.test.tsx`.
- Server actions (`GetProductBySlugAction`, `GetProductFromCart`) and `notFound` are mocked with `vi.mock`.
- The `AddToCart` component is shallow-mocked so the test can assert on the props it would receive.

## Future extensions

- Add assertions for image gallery behaviour if the page handles hero/thumbnail selection directly.
- Extend metadata tests when structured data (JSON-LD) or Open Graph images are introduced.

