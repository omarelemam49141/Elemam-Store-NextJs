import { insertOrderSchema } from '@/validations/order/order-validation'
import z from 'zod'

export type InsertOrderType = z.infer<typeof insertOrderSchema>

