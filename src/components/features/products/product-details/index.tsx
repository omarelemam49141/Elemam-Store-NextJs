import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import ProductPrice from "./product-price";

const ProductDetails = ({ product }: { product: any }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images[0]}
              alt={product.slug}
              height={300}
              width={300}
              className="mx-auto"
            ></Image>
          </Link>
        </CardHeader>
        <CardContent className="space-y-2 flex-grow">
          <p className="text-xs">{product.brand}</p>
          <h2 className="text-md">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h2>
        </CardContent>
        <CardFooter>
          <div className="flex-between w-full">
            <p>{product.rating} Stars</p>
            {product.stock > 0 ? (
              <ProductPrice value={product.price} />
            ) : (
              <p className="text-destructive">Out Of Stock</p>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default ProductDetails;
