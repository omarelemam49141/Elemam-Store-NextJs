import { PaginatedResponse } from "./../../types/shared/paginated-response-type";
import { PaginatedInput } from "@/types/shared/paginated-input-type";
import { prisma } from "../../lib/db/prisma";
import { GetProduct } from "@/types/products/get-product-type";

export async function GetProductsPaginated(
  input: PaginatedInput
): Promise<PaginatedResponse<GetProduct>> {
  const products = await prisma.product.findMany({
    where: input.search
      ? {
          OR: [
            {
              name: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: input.search,
                mode: "insensitive",
              },
            },
            {
              slug: {
                contains: input.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {},
    orderBy: {
      createdAt: input.sortDirection ?? "asc",
    },
    skip: (input.pageNumber - 1) * input.pageSize,
    take: input.pageSize,
  });
  const totalProductsCount = await prisma.product.count();
  const totalNumberOfPages = Math.ceil(totalProductsCount / input.pageSize);

  const response: PaginatedResponse<GetProduct> = {
    items: products,
    totalItemsCount: totalProductsCount,
    totalPagesCount: totalNumberOfPages,
  };

  return response;
}

export async function getProductBySlug(
  slug: string
): Promise<GetProduct | null> {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
