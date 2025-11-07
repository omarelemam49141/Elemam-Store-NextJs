# Prisma Decimal Handling

This guide explains how Elemam Store normalises Prisma `Decimal` values into JSON-safe JavaScript numbers across all Prisma operations.

## Overview

- **Purpose**: prevent `Prisma.Decimal` instances from leaking into React components, which would otherwise trigger serialization errors (`Only plain objects can be passed to Client Components`).
- **Implementation**: a Prisma Client query extension intercepts every operation result and converts any `Decimal` values to numbers.
- **Location**: `src/lib/db/prisma.ts` contains the shared client factory and conversion logic.

## How It Works

```ts:src/lib/db/prisma.ts
function convertDecimals(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber()
  }

  if (Array.isArray(value)) {
    return value.map(convertDecimals)
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof Buffer !== 'undefined' && value instanceof Buffer) {
    return value
  }

  if (value.constructor !== Object) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key,
      convertDecimals(entry)
    ])
  )
}

const extendedClient = client.$extends({
  query: {
    $allModels: {
      $allOperations: async ({ args, query }) => {
        const result = await query(args)
        return convertDecimals(result)
      }
    }
  },
  // ... existing result/model extensions
})
```

Key behaviour:

- Runs **after** every Prisma query or mutation succeeds.
- Recursively visits arrays and plain objects.
- Preserves `Date`, `Buffer`, and non-plain objects to avoid altering non-decimal payloads.
- Uses `Decimal#toNumber()` to retain fractional values while returning JS numbers.
- Result-level helpers (e.g. the `product.price` accessor) now tolerate data that is already a
  number or string, so repeated conversions and SSR serialisation do not throw.
- Server actions working with cart totals should treat monetary values as already-normalised
  numbers; use the shared `toNumeric` utility instead of calling `.toNumber()` directly.

## Usage Notes

- No extra imports are required; simply import `prisma` from `src/lib/db/prisma`.
- Whenever you add new server actions or data loaders, this conversion happens automatically.
- For advanced precision requirements (e.g. >15 significant digits), consider returning strings instead of numbers.

## Testing Checklist

- [ ] Load cart/order pages and confirm totals render without serialization errors.
- [ ] Create/update records with decimal fields to ensure mutations still succeed.
- [ ] Verify calculations downstream still receive numeric types (e.g. `Number.isFinite` checks).

## Related Docs

- [Prisma Client Extensions](https://www.prisma.io/docs/orm/prisma-client/client-extensions/query)
- [Cart Cleanup & Rate Limiting System](./cart-cleanup-system.md)

