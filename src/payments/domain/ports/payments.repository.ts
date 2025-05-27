import { Payment } from '../payment.entity';
import { SearchPaymentsFilters } from '../use-cases/search-payments/search-payments.port';

export abstract class PaymentsRepository {
  abstract save(payment: Payment): Promise<string>;
  abstract findByOrderId(orderId: string): Promise<Payment | null>;
  abstract findByExternalId(externalId: string): Promise<Payment | null>;
  abstract updateStatus(paymentId: string, status: string): Promise<void>;
  abstract search(
    filters: SearchPaymentsFilters,
  ): Promise<{ data: Payment[]; total: number }>;
}
