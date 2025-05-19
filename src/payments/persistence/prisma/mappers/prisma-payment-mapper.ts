import { Prisma, Payment as PrismaPayment } from '@prisma/client';
import { Payment } from '../../../domain/payment.entity';

export class PrismaPaymentMapper {
  static toDomain(raw: PrismaPayment): Payment {
    return Payment.create({
      id: raw.id,
      orderId: raw.orderId,
      status: raw.status as any,
      qrCode: raw.qrCode,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      amount: new Prisma.Decimal(raw.amount),
    });
  }

  static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status as any,
      qrCode: payment.qrCode,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      amount: payment.amount,
      externalId: '',
      retries: 0,
    };
  }
}