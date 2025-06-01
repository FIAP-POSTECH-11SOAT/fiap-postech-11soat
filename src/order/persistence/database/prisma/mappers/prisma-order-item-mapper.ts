import { Prisma, OrderItem as PrismaOrderItem } from '@prisma/client';

import { OrderItem } from 'src/order/domain/order-item.entity';

export class PrismaOrderItemMapper {
  static toDomain(raw: PrismaOrderItem): OrderItem {
    return OrderItem.create(
      {
        orderId: raw.orderId,
        itemId: raw.itemId,
        price: raw.price.toNumber(),
        quantity: raw.quantity,
      },
    );
  }

  static toPrisma(order: OrderItem): Prisma.OrderItemUncheckedCreateInput {
    return {
      orderId: order.orderId,
      itemId: order.itemId,
      price: order.price,
      quantity: order.quantity,
    };
  }
}
