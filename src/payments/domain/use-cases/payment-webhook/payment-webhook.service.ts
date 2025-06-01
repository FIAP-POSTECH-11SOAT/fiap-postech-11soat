import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';
import { PaymentStatus } from '../../payment.entity';
import { UpdatePaymentPort } from '../../ports/update-payment.port';
import { PaymentWebhookInput, PaymentWebhookPort } from '../../ports/payment-webhook.port';

@Injectable()
export class PaymentWebhookUseCase implements PaymentWebhookPort {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly updatePaymentPort: UpdatePaymentPort,
  ) { }

  async execute(input: PaymentWebhookInput): Promise<void> {
    const payment = await this.paymentsRepository.findByExternalId(input.externalId);

    if (!payment) throw new Error('Payment not found');

    const statusMap: Record<string, PaymentStatus> = {
      'payment.created': PaymentStatus.PENDING,
      'payment.updated': PaymentStatus.PENDING,
      'payment.in_process': PaymentStatus.PENDING,
      'payment.authorized': PaymentStatus.APPROVED,
      'payment.approved': PaymentStatus.APPROVED,
      'payment.refunded': PaymentStatus.REFUNDED,
      'payment.cancelled': PaymentStatus.FAILED,
      'payment.rejected': PaymentStatus.FAILED,
    };
    const newStatus = statusMap[input.status];

    if (!newStatus) throw new Error('Ivalid payment status');

    await this.updatePaymentPort.execute({ id: payment.id, payload: { status: newStatus } });

    const order = await this.ordersRepository.findById(payment.orderId);
    if (!order) throw new Error('Order not found');

    if (newStatus === 'APPROVED') order.status = 'TO_PREPARE';
    if (newStatus === 'FAILED' || newStatus === 'REFUNDED') order.status = 'CANCELLED';

    await this.ordersRepository.update(order);
  }
}
