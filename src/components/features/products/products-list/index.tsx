import ProductDetails from "../product-details";
import { GetProduct } from "@/types/products/get-product.type";

const ProductsList = ({
  data,
  title,
}: {
  data: GetProduct[];
  title?: string;
}) => {
  return (
    <>
      {title ? <h2 className="h2-bold mb-5">{title}</h2> : ""}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((product: GetProduct) => (
          <ProductDetails product={product} key={product.slug} />
        ))}
      </div>
    </>
  );
};

export default ProductsList;
