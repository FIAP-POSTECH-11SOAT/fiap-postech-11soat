import { PaymentStatus } from '../../payment.entity';

export abstract class UpdatePaymentPort {
  abstract execute(
    id: string,
    payload: { status: PaymentStatus },
  ): Promise<void>;
}
