import { PrismaClient, Product } from "@/generated/prisma";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter }).$extends({
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
