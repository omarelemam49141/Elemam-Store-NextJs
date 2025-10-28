import z from "zod";
import { PriceValidation } from "../shared/shared-validation";

export const CartItem = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  quantity: z.number().int().nonnegative("Quantity can't be less than 1"),
  price: PriceValidation,
  image: z.string().min(1, "Image is required"),
});

export const userCart = z.object({
  items: z.array(CartItem),
  itemsPrice: PriceValidation,
  shippingPrice: PriceValidation,
  taxPrice: PriceValidation,
  totalPrice: PriceValidation,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().nullable(),
});
