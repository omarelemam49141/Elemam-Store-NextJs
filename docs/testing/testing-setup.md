# Testing Setup

This project uses **Vitest** with React Testing Library to validate UI and data flow logic.

## Tooling

- `vitest` provides the test runner and coverage engine (configured via `vitest.config.ts`).
- `@vitejs/plugin-react` enables JSX transform and Fast Refresh-equivalent behavior inside tests.
- `@testing-library/jest-dom` and `@testing-library/react` extend assertions and render helpers for component tests.
- `msw` is available for API mocking when integration tests require HTTP interception.

## Commands

- `npm test` – run the full test suite with coverage output in `coverage/`.
- `npm run test:watch` – run tests in watch mode while developing.

## Configuration overview

- `vitest.config.ts`
  - Targets the `jsdom` environment.
  - Registers `vitest.setup.ts` for shared mocks.
  - Configures path alias `@` → `src/` to mirror Next.js imports.
  - Enforces baseline coverage thresholds (lines/statements ≥60%, functions ≥60%, branches ≥50%).
- `vitest.setup.ts`
  - Extends Jest DOM matchers and cleans up the DOM after every test.
  - Provides a `ResizeObserver` shim for components using responsive measurements.
  - Mocks `next/image` with a plain `<img>` tag to avoid Next.js loader requirements.

## Writing tests

- Place unit/component tests alongside the implementation or within a `__tests__` folder using the suffix `.test.tsx`.
- Prefer `renderWithProviders` (see `src/test-utils/render-with-providers.tsx`) for components that depend on theme or context providers.
- Page-level tests follow the same pattern: await the async page function, render the resulting element tree, and mock Next.js helpers (`redirect`, `notFound`, metadata generators) as needed.
- Use `msw` to stub network calls where necessary; see the individual case docs under `docs/testing/cases/`.
- Keep tests deterministic: avoid reliance on real timers, random values, or actual network IO.

## Related resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/)
- [MSW Docs](https://mswjs.io/docs/)

