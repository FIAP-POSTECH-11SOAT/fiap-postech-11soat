import { PaymentStatus as PrismaPaymentStatus } from '@prisma/client';
import { PaymentStatus } from '../payment.entity';

export class PaymentStatusMapper {
  static toDomain(status: PrismaPaymentStatus | string): PaymentStatus {
    const normalized = status.toString().toUpperCase();

    switch (normalized) {
      case 'PENDING':
        return PaymentStatus.PENDING;
      case 'APPROVED':
        return PaymentStatus.APPROVED;
      case 'FAILED':
        return PaymentStatus.FAILED;
      case 'REFUNDED':
        return PaymentStatus.REFUNDED;
      default:
        throw new Error(`Unknown payment status: ${status}`);
    }
  }

  static toPrisma(status: PaymentStatus): PrismaPaymentStatus {
    return status as PrismaPaymentStatus;
  }
}
