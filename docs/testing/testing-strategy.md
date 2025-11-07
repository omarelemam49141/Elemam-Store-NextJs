# Testing Strategy

This document describes how we approach automated testing across Elemam Store.

## Goals

- Guarantee critical commerce flows (product discovery, cart, checkout) behave as expected.
- Provide guardrails for regressions when iterating on UI or server actions.
- Keep tests fast and focused to encourage frequent execution in local development and CI.

## Test pyramid

| Layer | Tooling | Scope |
| --- | --- | --- |
| Unit / component | Vitest + Testing Library | Individual components and hooks |
| Integration | Vitest + Testing Library + MSW | Pages and server actions with mocked backends |
| E2E (future) | Playwright (planned) | Full user journeys in a browser |

## Coverage expectations

- Mission-critical UI components must have happy-path coverage.
- Server actions exposed to the client should include integration-style tests (mocked network) verifying success/error paths.
- Maintain ≥60% coverage for lines/statements/functions with targeted increases as features stabilize.

## Writing new tests

1. Prefer colocating tests with the implementation using `.test.tsx` suffix.
2. Use `renderWithProviders` from `src/test-utils/render-with-providers` to ensure theme/context are consistent.
3. Mock server actions using `vi.mock('@/lib/actions/...')` and provide deterministic payloads.
4. Keep assertions user-focused (DOM queries by role or text) to align with Testing Library guidance.
5. Document complex scenarios under `docs/testing/cases/`.

## Running tests

- `npm test` – full suite with coverage.
- `npm run test:watch` – watch mode for iterative development.

## When to extend the suite

- Adding new checkout/cart/product interactions.
- Adjusting server actions or business logic.
- Introducing regressions previously caught via manual QA.

## Related documents

- [Testing setup](./testing-setup.md)
- [Case studies](./cases/) directory for component-specific expectations.
- [Quality audits](../quality/performance-seo-security.md) for performance, SEO, and security checks beyond automated tests.

