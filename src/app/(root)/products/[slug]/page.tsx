import ProductPrice from "@/components/features/products/product-details/product-price";
import { Card, CardContent } from "@/components/ui/card";
import { GetProductBySlugAction } from "@/lib/actions/products/products.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ProductImages from "@/components/features/products/product-details/product-images";
import AddToCart from "@/components/features/cart/add-to-cart-btn";
import { DoesItemExistInCart } from "@/lib/actions/cart/cart.actions";
import RemoveItemFromCart from "@/components/features/cart/remove-from-cart-btn";

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const productDetails = await GetProductBySlugAction(slug);
  if (!productDetails) {
    notFound();
  }
  const itemExistsInCart = await DoesItemExistInCart(productDetails.id);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* start images */}
        <div className="col-span-2">
          <ProductImages images={productDetails.images} />
        </div>
        {/* end images */}

        {/* start product info */}
        <div className="col-span-2 space-y-6">
          <p>
            <span>
              {productDetails.brand} {productDetails.category}
            </span>
          </p>

          <h1 className="h2-bold">{productDetails.name}</h1>

          <p>
            {+productDetails.rating} of {productDetails.numReviews} Reviews
          </p>

          <ProductPrice
            value={+productDetails.price}
            className="bg-green-100 text-green-600 p-2 px-4 rounded-full w-fit"
          />

          <h2 className="font-bold mb-1">Description</h2>
          <p className="text-sm">{productDetails.description}</p>
        </div>
        {/* end product info */}

        {/* start add to cart */}
        <div className="col-span-1">
          <Card className="max-h-auto py-4">
            <CardContent className="space-y-4 max-h-auto">
              {/* start price */}
              <div className="flex-between">
                <p>Price</p>
                <ProductPrice value={+productDetails.price} />
              </div>
              {/* end price */}
              {/* start status */}
              <div className="flex-between">
                <p>Status</p>
                {productDetails.stock > 0 ? (
                  <Badge variant="outline">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              {/* end status */}
              {/* start add to cart btn */}
              {productDetails.stock > 0 && !itemExistsInCart && (
                <AddToCart
                  cartItem={{
                    productId: productDetails.id,
                    name: productDetails.name,
                    slug: productDetails.slug,
                    quantity: 1,
                    price: productDetails.price,
                    image: productDetails.images![0],
                  }}
                />
              )}
              {/* end add to cart btn */}

              {/* start delete from cart btn */}
              {itemExistsInCart && (
                <RemoveItemFromCart
                  cartItem={{
                    productId: productDetails.id,
                    name: productDetails.name,
                    slug: productDetails.slug,
                  }}
                />
              )}
              {/* end delete from cart btn */}
            </CardContent>
          </Card>
        </div>
        {/* end add to cart */}
      </div>
    </>
  );
};

export default ProductDetails;
