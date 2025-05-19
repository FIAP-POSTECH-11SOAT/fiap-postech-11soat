import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../domain/ports/payments.repository';
import { Payment } from '../../domain/payment.entity';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaPaymentMapper } from './mappers/prisma-payment-mapper';

@Injectable()
export class PrismaPaymentsRepository implements PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(payment: Payment): Promise<string> {
    const data = PrismaPaymentMapper.toPrisma(payment);
    const created = await this.prisma.payment.create({ data });
    return created.id;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const found = await this.prisma.payment.findFirst({ where: { orderId } });
    if (
      found &&
      PrismaPaymentMapper instanceof Object &&
      'toDomain' in PrismaPaymentMapper &&
      typeof PrismaPaymentMapper.toDomain === 'function'
    ) {
      if (typeof PrismaPaymentMapper.toDomain === 'function') {
        const domainPayment = PrismaPaymentMapper.toDomain(found);
        if (domainPayment instanceof Payment) {
          return domainPayment;
        }
      }
      throw new Error('Invalid payment data or mapper function.');
    }
    return null;
  }

  async updateStatus(paymentId: string, status: string): Promise<void> {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
  }
}