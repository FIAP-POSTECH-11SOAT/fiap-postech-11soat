import { CustomerOrder } from 'src/order/domain/customer-order.entity';
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

  async save(order: Order, customerOrder?: CustomerOrder): Promise<string> {
    return await this.prisma.$transaction(async (tx) => {
      const prismaOrder = PrismaOrderMapper.toPrisma(order);
      const newOrder = await tx.order.create({ data: prismaOrder });
      if (customerOrder) {
        const prismaCustomerOrder = PrismaCustomerOrderMapper.toPrisma(customerOrder);
        await tx.customerOrder.create({ data: prismaCustomerOrder });
      }
      return newOrder.id;
    });
  }

  async createOrderItem(orderItem: OrderItem): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const prismaOrderItem = PrismaOrderItemMapper.toPrisma(orderItem);
      await tx.orderItem.create({ data: prismaOrderItem });
      await tx.order.update({
        where: { id: orderItem.orderId },
        data: { total: { increment: (orderItem.price * orderItem.quantity) } },
      });
    });
  }

  async deleteOrderItem(orderItem: OrderItem): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const deletedItem = await tx.orderItem.delete({
        where: { orderId_itemId: { orderId: orderItem.orderId, itemId: orderItem.itemId } },
      });
      await tx.order.update({
        where: { id: orderItem.orderId },
        data: { total: { decrement: (deletedItem.price.toNumber() * deletedItem.quantity) } },
      });
    });
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return null;
    return PrismaOrderMapper.toDomain(order);
  }

  async findCustomerOrder(orderId: string): Promise<CustomerOrder | null> {
    const customerOrder = await this.prisma.customerOrder.findFirst({ where: { orderId } });
    if (!customerOrder) return null;
    return PrismaCustomerOrderMapper.toDomain(customerOrder);
  }

  async findOrderItems(orderId: string): Promise<OrderItem[]> {
    const items = await this.prisma.orderItem.findMany({ where: { orderId }, });
    return items.map(item => PrismaOrderItemMapper.toDomain(item));
  }

  async update(order: Order): Promise<void> {
    const prismaOrder = PrismaOrderMapper.toPrisma(order);
    await this.prisma.order.update({
      where: { id: order.id },
      data: prismaOrder,
    });
  }
}
