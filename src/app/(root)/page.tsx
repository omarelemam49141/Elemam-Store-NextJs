import ProductsList from "@/components/features/products/products-list";
import { GetProductsPaginatedAction } from "@/lib/actions/products/products-actions";
import { NEWEST_ARRIVAL_PRODUCTS_COUNT } from "@/lib/constants";
import { PaginatedInput } from "@/types/shared/paginated-input-type";

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
