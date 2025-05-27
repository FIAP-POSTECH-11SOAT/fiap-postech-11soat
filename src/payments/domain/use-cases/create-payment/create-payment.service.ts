import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';
import { MercadoPagoService } from 'src/infra/mercadopago/mercado-pago.service';
import { Payment } from '../../payment.entity';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async execute(
    orderId: string,
  ): Promise<{ paymentId: string; qrCode: string }> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    const pixPaymentResponse = await this.mercadoPagoService.createPixPayment(
      orderId,
      order.total.toNumber(),
    );

    if (
      !pixPaymentResponse ||
      !pixPaymentResponse.qrCode ||
      !pixPaymentResponse.externalId
    ) {
      throw new Error('Failed to create Pix payment');
    }

    const qrCode =
      typeof pixPaymentResponse?.qrCode === 'string'
        ? pixPaymentResponse.qrCode
        : '';
    const externalId = pixPaymentResponse?.externalId;

    if (!qrCode || !externalId) {
      throw new Error('Failed to create Pix payment');
    }

    const payment = Payment.create({
      orderId: order.id,
      qrCode,
      amount: order.total,
    });

    const paymentId = await this.paymentsRepository.save(payment);

    return {
      paymentId,
      qrCode,
    };
  }
}
