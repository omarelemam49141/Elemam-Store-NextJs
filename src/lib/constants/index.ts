import { env } from "process";

export const APP_NAME = env.APP_NAME || "Elemam Store";
export const APP_DESCRIPTION = env.APP_DESCRIPTION || "Elemam Store";
export const SERVER_URL = env.SERVER_URL!;
export const NEWEST_ARRIVAL_PRODUCTS_COUNT =
  +env.NEWEST_ARRIVAL_PRODUCTS_COUNT!;
export const CART_ID_SESSION = "cart_id_session";
export const CART_RATE_LIMIT_PER_HOUR = parseInt(
  env.CART_RATE_LIMIT_PER_HOUR || "50",
  10
);
