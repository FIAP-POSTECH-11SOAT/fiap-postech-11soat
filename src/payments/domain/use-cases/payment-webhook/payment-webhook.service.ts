import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';
import { UpdatePaymentPort } from '../../ports/update-payment.port';
import { PaymentWebhookInput, PaymentWebhookPort } from '../../ports/payment-webhook.port';
import { PaymentGatewayPort } from '../../ports/payment-gateway.port';

@Injectable()
export class PaymentWebhookUseCase implements PaymentWebhookPort {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly updatePaymentPort: UpdatePaymentPort,
    private readonly paymentGatewayPort: PaymentGatewayPort,
  ) { }

  async execute(input: PaymentWebhookInput): Promise<void> {
    const payment = await this.paymentsRepository.findByExternalId(input.externalId)

    if (!payment) throw new Error('Payment not found');

    const paymentStatus = await this.paymentGatewayPort.getPaymentStatusByExternalId(input.externalId)

    await this.updatePaymentPort.execute({ id: payment.id, payload: { status: paymentStatus } });

    const order = await this.ordersRepository.findById(payment.orderId);
    if (!order) throw new Error('Order not found');

    if (paymentStatus === 'APPROVED') order.status = 'TO_PREPARE';
    if (paymentStatus === 'FAILED' || paymentStatus === 'REFUNDED') order.status = 'CANCELLED';

    await this.ordersRepository.update(order);
  }
}
