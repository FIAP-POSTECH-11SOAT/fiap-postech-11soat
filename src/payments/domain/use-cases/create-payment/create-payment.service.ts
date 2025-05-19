import { CreatePaymentPort } from './create-payment.port';
import { PaymentsRepository } from '../../ports/payments.repository';
import { Payment, CreatePaymentProps } from '../../payment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreatePaymentUseCase implements CreatePaymentPort {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async execute(props: CreatePaymentProps): Promise<string> {
    const payment = Payment.create(props);
    return await this.paymentsRepository.save(payment);
  }
}
