import ProductsList from "@/components/features/products/products-list";
import sampleData from "../../../db/sample-data";

export default async function Home() {
  return (
    <>
      <ProductsList
        data={sampleData.products}
        limit={6}
        title="Newest Arrival"
      />
    </>
  );
}
