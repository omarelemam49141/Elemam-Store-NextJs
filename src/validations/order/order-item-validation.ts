import z from 'zod'
import { PriceValidation } from '../shared/shared-validation'

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  qty: z.number().int().min(1, 'Quantity must be at least 1'),
  price: PriceValidation
})

