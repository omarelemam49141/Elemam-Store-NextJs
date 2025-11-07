import { orderItemSchema } from '@/validations/order/order-item-validation'
import z from 'zod'

export type OrderItemType = z.infer<typeof orderItemSchema>

