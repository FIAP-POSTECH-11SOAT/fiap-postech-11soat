import { Prisma, Order as PrismaOrder } from '@prisma/client';

import { Order } from 'src/order/domain/order.entity';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return new Order(
      {
        total: raw.total.toNumber(),
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }
}
