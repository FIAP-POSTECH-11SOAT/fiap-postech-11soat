import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { PaymentStatus } from '../../payment.entity';
import { UpdatePaymentPort } from './update-payment.port';

@Injectable()
export class UpdatePaymentUseCase implements UpdatePaymentPort {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async execute(
    id: string,
    { status }: { status: PaymentStatus },
  ): Promise<void> {
    if (!['PENDING', 'COMPLETED', 'FAILED'].includes(status)) {
      throw new Error('Invalid payment status');
    }

    await this.paymentsRepository.updateStatus(id, status);
  }
}
