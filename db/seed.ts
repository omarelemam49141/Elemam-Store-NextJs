import { prisma } from "./prisma";
import sampleData from "./sample-data";

async function SeedData() {
  const productsCount = await prisma.product.count();

  if (productsCount > 0) {
    return;
  }

  await prisma.product.createMany({ data: sampleData.products });
  console.log("Seeding done successfully!");
}

SeedData();
