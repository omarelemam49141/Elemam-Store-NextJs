import { Prisma, PrismaClient } from '@/generated/prisma';

// Global variable to cache the Prisma client
declare global {
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

function convertDecimals(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  if (Array.isArray(value)) {
    return value.map(convertDecimals);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof Buffer !== 'undefined' && value instanceof Buffer) {
    return value;
  }

  if (value.constructor !== Object) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key,
      convertDecimals(entry),
    ])
  );
}

// Create a single instance of Prisma Client for serverless functions
const createPrismaClient = () => {
  // For Vercel deployment, use the standard Prisma client without Neon adapter
  // The Neon adapter with WebSockets doesn't work well in serverless environments
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

  const extendedClient = client.$extends({
    query: {
      $allModels: {
        $allOperations: async ({ args, query }) => {
          const result = await query(args);
          return convertDecimals(result);
        },
      },
    },
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(product) {
            if (product.price === null || product.price === undefined) {
              return product.price
            }

            if (product.price instanceof Prisma.Decimal) {
              return product.price.toNumber()
            }

            if (typeof product.price === 'number') {
              return product.price
            }

            if (typeof product.price === 'string') {
              const parsed = Number(product.price)
              return Number.isNaN(parsed) ? product.price : parsed
            }

            return product.price
          },
        },
        rating: {
          needs: { rating: true },
          compute(product) {
            return product.rating?.toString();
          },
        },
      },
    },

    model: {
      $allModels: {
        $types: {} as {
          Decimal: number; // 👈 this is now a TYPE, not a value
        },
      },
    },
  });

  return extendedClient;
};

// Use global variable to cache the Prisma client in development
// This prevents multiple instances in serverless functions
export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
