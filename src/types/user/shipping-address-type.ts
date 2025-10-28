import { shippingAddressValidation } from "@/validations/user/shipping-address-validation";
import z from "zod";

export type ShippingAddressType = z.infer<typeof shippingAddressValidation>;