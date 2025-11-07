import type { Metadata } from "next";
import ProductsList from "@/components/features/products/products-list";
import { GetProductsPaginatedAction } from "@/lib/actions/products/products-actions";
import { APP_DESCRIPTION, APP_NAME, NEWEST_ARRIVAL_PRODUCTS_COUNT } from "@/lib/constants";
import { PaginatedInput } from "@/types/shared/paginated-input-type";

export const metadata: Metadata = {
  title: "Home",
  description: `${APP_DESCRIPTION} Discover the newest arrivals, curated for modern shoppers.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${APP_NAME} | Newest Arrivals`,
    description: `${APP_DESCRIPTION} Browse the latest products, updated daily for you.`,
    url: "/",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  //properties
  const productsPaginatedInput: PaginatedInput = {
    pageNumber: 1,
    pageSize: NEWEST_ARRIVAL_PRODUCTS_COUNT,
    sortDirection: "desc",
  };
  //actions
  const newestArrivalProductsResponse = await GetProductsPaginatedAction(
    productsPaginatedInput
  );

  return (
    <>
      <ProductsList
        data={newestArrivalProductsResponse.items}
        title="Newest Arrival"
      />
    </>
  );
}
