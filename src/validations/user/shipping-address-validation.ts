import { ShippingAddressType } from "@/types/user/shipping-address-type";
import z from "zod";

export const shippingAddressValidation = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long").max(50, "Full name must be less than 50 characters long"),
  phone: z.string().min(10, "Phone must be at least 10 characters long").max(15, "Phone must be less than 15 characters long"),
  address: z.string().min(3, "Address must be at least 3 characters long").max(100, "Address must be less than 100 characters long"),
  city: z.string().min(3, "City must be at least 3 characters long").max(50, "City must be less than 50 characters long"),
  state: z.string().min(3, "State must be at least 3 characters long").max(50, "State must be less than 50 characters long"),
  zip: z.string().min(5, "Zip must be at least 5 characters long").max(10, "Zip must be less than 10 characters long"),
  country: z.string().min(3, "Country must be at least 3 characters long").max(50, "Country must be less than 50 characters long"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});


export const defaultShippingAddress: ShippingAddressType = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  latitude: '',
  longitude: ''
};