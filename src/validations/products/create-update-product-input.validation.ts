import * as z from "zod";
import { PriceValidation } from "../shared/shared.validation";

export const CreateUpdateProductInputValidation = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  slug: z.string().min(3, "Product slug must be at least 3 characters long"),
  category: z
    .string()
    .min(2, "Product category must be at least 2 characters long"),
  images: z.array(z.string()).min(1, "You must provide at least 1 image"),
  brand: z.string().min(2, "Product brand must be at least 2 characters long"),
  description: z
    .string()
    .min(3, "Product description must be at least 2 characters long"),
  stock: z.coerce.number().min(0, "Stock can't be less than 0"),
  price: PriceValidation,
  isFeatured: z.boolean(),
  banner: z
    .string()
    .min(2, "Product banner must be at least 2 characters long")
    .nullable(),
});
