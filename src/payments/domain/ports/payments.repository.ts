import { Payment } from '../payment.entity';

export abstract class PaymentsRepository {
  abstract save(payment: Payment): Promise<string>;
  abstract findByOrderId(orderId: string): Promise<Payment | null>;
  abstract updateStatus(paymentId: string, status: string): Promise<void>;
}
