import { PaymentsRepository } from '../../domain/ports/payments.repository';
import { Payment } from '../../domain/payment.entity';

export class InMemoryPaymentsRepository implements PaymentsRepository {
  private payments: Payment[] = [];

  save(payment: Payment): Promise<string> {
    this.payments.push(payment);
    return Promise.resolve(payment.id);
  }

  findByOrderId(orderId: string): Promise<Payment | null> {
    const payment = this.payments.find((p) => p.orderId === orderId);
    return Promise.resolve(payment || null);
  }

  updateStatus(paymentId: string, status: Payment['status']): Promise<void> {
    const index = this.payments.findIndex((p) => p.id === paymentId);
    if (index !== -1) {
      this.payments[index].status = status;
    }
    return Promise.resolve();
  }
}
