import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { UpdatePaymentUseCase } from '../update-payment/update-payment.service';
import { PaymentStatusMapper } from '../../mappers/payment-status.mapper';
import { OrderStatusClient } from 'src/infra/http-server/order-status.client';

@Injectable()
export class HandlePaymentWebhookUseCase {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly orderStatusClient: OrderStatusClient,
  ) {}

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
      console.warn(`Evento ${eventType} não mapeado.`);
      return { message: 'Evento não processado' };
    }

    await this.updatePaymentUseCase.execute(payment.id, {
      status: PaymentStatusMapper.toDomain(newStatus),
    });

    if (newStatus === 'APPROVED') {
      await this.orderStatusClient.updateOrderStatus(
        payment.orderId,
        'APPROVED',
      );
    }

    return { message: 'Status atualizado com sucesso' };
  }
}
