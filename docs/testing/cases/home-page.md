# Home Page Tests

## Purpose

Verify that the landing page surfaces the newest arrival products retrieved via the paginated server action and remains stable when no products are returned.

## Covered scenarios

- Successful server action call renders the section heading and product cards.
- Empty payload keeps the heading visible while omitting product links.

## Implementation notes

- Tests reside in `src/tests/app/(root)/page.test.tsx`.
- `GetProductsPaginatedAction` is mocked via `vi.mock` to provide deterministic data.
- The async page component is invoked directly (`await Home()`) before rendering with `renderWithProviders`.

## Future extensions

- Add regression tests for pagination or filtering once home page introduces those controls.
- Validate SEO metadata via unit tests or snapshot comparisons if title/description logic evolves.

