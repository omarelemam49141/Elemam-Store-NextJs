# Order Details Page Tests

## Purpose

Ensure the order detail route renders persisted order information and metadata, and falls back to `notFound` when necessary.

## Covered scenarios

- Successful responses render shipping, payment, cart, and order summaries with the expected props.
- Failed lookups invoke `notFound()`.
- Metadata generation adapts based on whether the order exists.

## Implementation notes

- Tests live in `src/app/(root)/orders/details/[id]/page.test.tsx`.
- `GetOrderDetailsAction` and `notFound` are mocked; summaries are shallow-mocked to assert their props.
- `getUuidSuffix` is used inside the page; tests rely on its behaviour indirectly by checking headings and metadata output.

## Future extensions

- Add tests for additional order actions (e.g., reorder, download invoice) if introduced.

