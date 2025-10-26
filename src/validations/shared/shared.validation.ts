import * as z from "zod";

export const PriceValidation = z.coerce
  .number()
  .refine(
    (value) => Number.isInteger(Math.round(value * 100)),
    "Price must have at most 2 decimal places"
  );
