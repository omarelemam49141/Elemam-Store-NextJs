import { userCart } from "@/validations/cart/cart-item-validation";
import z from "zod";

export type CartType = z.infer<typeof userCart>;
