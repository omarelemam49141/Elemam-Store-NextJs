import { prisma } from "./prisma";
import sampleData from "./sample-data";

async function SeedData() {
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();
  const paymentMethodsCount = await prisma.paymentMethod.count();

  if (productsCount == 0) {
    await prisma.product.createMany({ data: sampleData.products });
  }

  if (usersCount == 0) {
    await prisma.user.createMany({ data: sampleData.users });
  }

  if (paymentMethodsCount == 0) {
    await prisma.paymentMethod.createMany({ data: sampleData.paymentMethods });
  }

  console.log("Seeding done successfully!");
}

SeedData();
