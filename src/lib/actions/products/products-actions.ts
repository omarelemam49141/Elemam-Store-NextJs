"use server";

import {
  getProductBySlug,
  GetProductsPaginated,
} from "@/services/products/products-service";
import { PaginatedInput } from "@/types/shared/paginated-input-type";
import { PaginatedResponse } from "@/types/shared/paginated-response-type";
import { GetProduct } from "@/types/products/get-product-type";

export async function GetProductsPaginatedAction(
  input: PaginatedInput
): Promise<PaginatedResponse<GetProduct>> {
  const products = await GetProductsPaginated(input);
  return products;
}

export async function GetProductBySlugAction(
  slug: string
): Promise<GetProduct | null> {
  return await getProductBySlug(slug);
}
