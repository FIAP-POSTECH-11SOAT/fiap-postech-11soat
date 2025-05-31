import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { Payment } from '../../payment.entity';
import { PaymentStatusMapper } from '../../mappers/payment-status.mapper';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';
import { CreatePaymentPort } from '../../ports/create-payment.port';
import { PaymentGatewayPort } from '../../ports/payment-gateway.port';

@Injectable()
export class CreatePaymentUseCase implements CreatePaymentPort {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly PaymentGatewayPort: PaymentGatewayPort,
  ) { }

  async execute(orderId: string): Promise<string> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) throw new Error('Order not found');

    if (order.status !== 'AWAITING') {
      throw new Error(
        `Cannot create payment for order with status ${order.status}`,
      );
    }

    const { qrCode, externalId, status } = await this.PaymentGatewayPort.createPixPayment(orderId, Number(order.total));
    if (!qrCode) throw new Error('QR Code not received from MercadoPago');
    if (!externalId) throw new Error('External ID not received from MercadoPago');

    const payment = Payment.create({
      orderId,
      amount: order.total,
      qrCode,
      externalId,
      status: status ? PaymentStatusMapper.toDomain(status) : undefined,
    });

    return await this.paymentsRepository.save(payment);
  }
}
