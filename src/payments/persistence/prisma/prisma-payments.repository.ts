import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../domain/ports/payments.repository';
import { Payment } from '../../domain/payment.entity';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaPaymentMapper } from './mappers/prisma-payment-mapper';
import { SearchPaymentsFilters } from 'src/payments/domain/ports/search-payments.port';

@Injectable()
export class PrismaPaymentsRepository implements PaymentsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async save(payment: Payment): Promise<string> {
    const data = PrismaPaymentMapper.toPrisma(payment);
    const created = await this.prisma.payment.create({ data });
    return created.id;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const found = await this.prisma.payment.findFirst({ where: { orderId } });
    return found ? PrismaPaymentMapper.toDomain(found) : null;
  }

  async updateStatus(paymentId: string, status: string): Promise<void> {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: status as any },
    });
  }

  async findByExternalId(externalId: string): Promise<Payment | null> {
    const result = await this.prisma.payment.findFirst({
      where: { externalId },
    });
    return result ? PrismaPaymentMapper.toDomain(result) : null;
  }

  async search(
    filters: SearchPaymentsFilters,
  ): Promise<{ data: Payment[]; total: number }> {
    const {
      status,
      orderId,
      cpf,
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: any = {};
    if (status) where.status = status;
    if (orderId) where.orderId = orderId;
    if (cpf) {
      where.order = {
        customers: {
          some: {
            customer: {
              document: cpf,
            },
          },
        },
      };
    }

    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: {
          order: {
            include: {
              customers: {
                include: {
                  customer: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments.map((payment) => PrismaPaymentMapper.toDomain(payment)),
      total,
    };
  }
}
