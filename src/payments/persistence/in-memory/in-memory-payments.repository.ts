import { PaymentsRepository } from '../../domain/ports/payments.repository';
import { Payment } from '../../domain/payment.entity';
import { SearchPaymentsFilters } from '../../domain/use-cases/search-payments/search-payments.port';

export class InMemoryPaymentsRepository implements PaymentsRepository {
  private payments: Payment[] = [];

  async save(payment: Payment): Promise<string> {
    this.payments.push(payment);
    return payment.id;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.payments.find((p) => p.orderId === orderId) || null;
  }

  async updateStatus(paymentId: string, status: string): Promise<void> {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (payment) {
      payment.status = status as any;
    }
  }

  async findByExternalId(externalId: string): Promise<Payment | null> {
    return this.payments.find((p) => p.externalId === externalId) || null;
  }

  async search(
    filters: SearchPaymentsFilters,
  ): Promise<{ data: Payment[]; total: number }> {
    let filtered = [...this.payments];

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.orderId) {
      filtered = filtered.filter((p) => p.orderId === filters.orderId);
    }

    const total = filtered.length;
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const sorted = [...filtered].sort((a, b) => {
      const field = filters.sortBy ?? 'createdAt';
      const order = filters.sortOrder ?? 'desc';
      const valA = a[field as keyof Payment];
      const valB = b[field as keyof Payment];
      if (valA instanceof Date && valB instanceof Date) {
        return order === 'asc'
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }
      return 0;
    });

    return {
      data: sorted.slice(start, end),
      total,
    };
  }
}
