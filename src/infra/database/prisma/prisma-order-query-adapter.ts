import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OrderQueryPort } from 'src/payments/domain/ports/order-query.port';

@Injectable()
export class PrismaOrderQueryAdapter implements OrderQueryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getOrderStatus(
    orderId: string,
  ): Promise<{ id: string; status: string; total: number } | null> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return null;
    }

    return {
      id: order.id,
      status: order.status,
      total: order.total.toNumber(),
    };
  }
}
