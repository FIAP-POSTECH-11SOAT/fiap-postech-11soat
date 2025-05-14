import { FullOrder } from 'src/shared/@types/FullOrder';
import { Order } from 'src/order/domain/order.entity';
import { OrderItem } from '@prisma/client';

export abstract class OrdersRepository {
  abstract save(order: Order, customerId: string): Promise<string>;
  abstract findById(orderId: string): Promise<FullOrder | null>
  abstract createOrderItem(orderItem: OrderItem): Promise<void>
  abstract deleteOrderItem(orderId: string, itemId: string): Promise<void>
}
