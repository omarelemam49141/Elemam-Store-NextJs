import { PrismaClient } from "@/generated/prisma";

// Global variable to cache the Prisma client
declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

// Create a single instance of Prisma Client for serverless functions
const createPrismaClient = () => {
  // For Vercel deployment, use the standard Prisma client without Neon adapter
  // The Neon adapter with WebSockets doesn't work well in serverless environments
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends({
    result: {
      product: {
        price: {
          needs: { price: true },
          compute(product) {
            // Convert Decimal to number
            return product.price?.toNumber();
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
};

// Use global variable to cache the Prisma client in development
// This prevents multiple instances in serverless functions
export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
