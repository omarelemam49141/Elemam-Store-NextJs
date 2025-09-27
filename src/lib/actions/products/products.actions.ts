"use server";

import { Product } from "@/generated/prisma";
import {
  getProductBySlug,
  GetProductsPaginated,
} from "@/services/products/products.services";
import { PaginatedInput } from "@/types/shared/paginated-input.type";
import { PaginatedResponse } from "@/types/shared/paginated-response.type";

export async function GetProductsPaginatedAction(
  input: PaginatedInput
): Promise<PaginatedResponse<Product>> {
  const products = await GetProductsPaginated(input);
  return products;
}

export async function GetProductBySlugAction(
  slug: string
): Promise<Product | null> {
  return await getProductBySlug(slug);
}
