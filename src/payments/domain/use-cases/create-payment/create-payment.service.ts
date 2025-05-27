import { Inject, Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { MercadoPagoService } from 'src/infra/mercadopago/mercado-pago.service';
import { Payment } from '../../payment.entity';
import { ORDER_QUERY_PORT, OrderQueryPort } from '../../ports/order-query.port';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentStatusMapper } from '../../mappers/payment-status.mapper';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(ORDER_QUERY_PORT)
    private readonly orderQueryPort: OrderQueryPort,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async execute(orderId: string): Promise<string> {
    const order = await this.orderQueryPort.getOrderStatus(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'AWAITING') {
      throw new Error(
        `Cannot create payment for order with status ${order.status}`,
      );
    }

    const { qrCode, externalId, status } =
      await this.mercadoPagoService.createPixPayment(
        orderId,
        Number(order.total),
      );

    if (!qrCode) {
      throw new Error('QR Code not received from MercadoPago');
    }

    if (!externalId) {
      throw new Error('External ID not received from MercadoPago');
    }

    const payment = Payment.create({
      orderId,
      amount: new Decimal(order.total),
      qrCode,
      externalId,
      status: status ? PaymentStatusMapper.toDomain(status) : undefined,
    });

    return await this.paymentsRepository.save(payment);
  }
}
