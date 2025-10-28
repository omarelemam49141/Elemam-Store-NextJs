import { CreateUpdateProductInputValidation } from "../../validations/products/create-update-product-input.validation";
import z from "zod";

export type CreateUpateProductInputType = z.infer<
  typeof CreateUpdateProductInputValidation
> & {
  id?: string;
};
