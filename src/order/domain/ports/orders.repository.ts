import { CustomerOrder } from '../customer-order.entity';
import { FullOrder } from 'src/shared/@types/FullOrder';
import { Order } from '../order.entity';
import { OrderItem } from '../order-item.entity';

export abstract class OrdersRepository {
  abstract save(order: Order, customerOrder?: CustomerOrder): Promise<string>;
  abstract findById(orderId: string): Promise<FullOrder | null>
  abstract createOrderItem(orderItem: OrderItem): Promise<void>
  abstract deleteOrderItem(orderId: string, itemId: string): Promise<void>
}
