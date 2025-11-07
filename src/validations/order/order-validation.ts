import z from 'zod'
import { PriceValidation } from '../shared/shared-validation'
import { shippingAddressValidation } from '../user/shipping-address-validation'
import { orderItemSchema } from './order-item-validation'

export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  itemsPrice: PriceValidation,
  shippingPrice: PriceValidation,
  taxPrice: PriceValidation,
  totalPrice: PriceValidation,
  paymentMethodId: z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    { message: 'Invalid payment method ID' }
  ),
  shippingAddress: shippingAddressValidation
})

