import { PaymentMethodValidation } from './../../validations/payment-methods/payment-method-validation';
import z from 'zod';

export type PaymentMethodType = z.infer<typeof PaymentMethodValidation> & {
  id: string;
}