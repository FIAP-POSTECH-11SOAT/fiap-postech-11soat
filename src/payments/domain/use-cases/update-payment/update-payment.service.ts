import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { UpdatePaymentInput, UpdatePaymentPort } from '../../ports/update-payment.port';
import { PaymentStatus } from '../../payment.entity';

@Injectable()
export class UpdatePaymentUseCase implements UpdatePaymentPort {
  constructor(private readonly paymentsRepository: PaymentsRepository) { }

  async execute({ id, payload }: UpdatePaymentInput): Promise<void> {
    const validStatus = [PaymentStatus.PENDING, PaymentStatus.APPROVED, PaymentStatus.FAILED, PaymentStatus.REFUNDED];
    if (!validStatus.includes(payload.status)) throw new Error('Invalid payment status');
    await this.paymentsRepository.updateStatus(id, payload.status);
  }
}