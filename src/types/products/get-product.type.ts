import { CreateUpdateProductInputValidation } from "../../validations/products/create-update-product-input.validation";
import z from "zod";

export type GetProduct = z.infer<typeof CreateUpdateProductInputValidation> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};
