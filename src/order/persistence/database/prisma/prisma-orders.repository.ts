import { CustomerOrder } from 'src/order/domain/customer-order.entity';
import { FullOrder } from 'src/shared/@types/FullOrder';
import { Injectable } from '@nestjs/common';
import { Order } from 'src/order/domain/order.entity';
import { OrderItem } from 'src/order/domain/order-item.entity';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';
import { PrismaCustomerOrderMapper } from './mappers/prisma-customer-orders-mapper';
import { PrismaOrderItemMapper } from './mappers/prisma-order-item-mapper';
import { PrismaOrderMapper } from './mappers/prisma-order-mapper';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) { }

  async save(order: Order, customerId: string): Promise<string> {
    const orderData = PrismaOrderMapper.toPrisma(order);

    return await this.prisma.$transaction(async (tx) => {
      const storedOrder = await tx.order.create({ data: orderData });

      const customerOrder = CustomerOrder.create({
        customerId: customerId,
        orderId: storedOrder.id,
      });
      const customerOrderData = PrismaCustomerOrderMapper.toPrisma(customerOrder);
      await tx.customerOrder.create({ data: customerOrderData });

      return storedOrder.id;
    });
  }

  async findById(orderId: string): Promise<FullOrder | null> {
    return await this.prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({ where: { id: orderId } });
      if (!existingOrder) return null;

      const orderItems = await tx.orderItem.findMany({ where: { orderId }, });
      const customerOrders = await tx.customerOrder.findFirst({ where: { orderId }, });

      return {
        orderDetails: PrismaOrderMapper.toDomain(existingOrder),
        items: orderItems.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
        })),
        customerId: customerOrders?.customerId || null,
      };
    });
  }

  async createOrderItem(orderItem: OrderItem): Promise<void> {
    const data = PrismaOrderItemMapper.toPrisma(orderItem);
    await this.prisma.$transaction(async (tx) => {
      await tx.orderItem.create({ data });

      await tx.order.update({
        where: { id: orderItem.orderId },
        data: { total: { increment: (orderItem.price.toNumber() * orderItem.quantity) } },
      });
    });
  }

  async deleteOrderItem(orderId: string, itemId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const deletedItem = await tx.orderItem.delete({ where: { orderId_itemId: { orderId, itemId } }, });

      await tx.order.update({
        where: { id: orderId },
        data: { total: { decrement: (deletedItem.price.toNumber() * deletedItem.quantity) } },
      });
    });
  }
}
