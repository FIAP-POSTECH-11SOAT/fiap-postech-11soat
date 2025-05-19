import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { Payment } from '../../payment.entity';
import { GetPaymentByOrderIdPort } from './get-payment-by-order-id.port';

@Injectable()
export class GetPaymentByOrderIdUseCase implements GetPaymentByOrderIdPort {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async execute(orderId: string): Promise<Payment | null> {
    return this.paymentsRepository.findByOrderId(orderId);
  }
}
