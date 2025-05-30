import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { UpdatePaymentUseCase } from '../update-payment/update-payment.service';
import { PaymentStatusMapper } from '../../mappers/payment-status.mapper';
import { OrderStatusClient } from 'src/infra/http-server/order-status.client';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';

@Injectable()
export class HandlePaymentWebhookUseCase {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
  ) { }

  async execute(externalId: string, eventType: string) {
    const payment = await this.paymentsRepository.findByExternalId(externalId);

    if (!payment) {
      console.warn(`Pagamento com externalId ${externalId} não encontrado.`);
      return { message: 'Pagamento não encontrado' };
    }

    const statusMap: Record<string, string> = {
      'payment.created': 'PENDING',
      'payment.updated': 'PENDING',
      'payment.in_process': 'PENDING',
      'payment.authorized': 'APPROVED',
      'payment.approved': 'APPROVED',
      'payment.refunded': 'REFUNDED',
      'payment.cancelled': 'FAILED',
      'payment.rejected': 'FAILED',
    };

    const newStatus = statusMap[eventType];

    if (!newStatus) {
      return { message: 'Event not processed' };
    }

    await this.updatePaymentUseCase.execute(payment.id, {
      status: PaymentStatusMapper.toDomain(newStatus),
    });

    const order = await this.ordersRepository.findById(payment.orderId);
    if (!order) throw new Error('Order not found');

    if (newStatus === 'APPROVED') {
      order.status = 'TO_PREPARE';
    }
    if (newStatus === 'FAILED' || newStatus === 'REFUNDED') {
      order.status = 'CANCELLED';
    }

    await this.ordersRepository.update(order);

    return { message: 'Status updated' };
  }
}
