import { CartItem } from "@/validations/cart/cart-item.validation";
import z from "zod";

export type CartItemType = z.infer<typeof CartItem>;