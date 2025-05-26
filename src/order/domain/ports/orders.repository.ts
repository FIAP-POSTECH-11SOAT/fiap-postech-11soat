import { CustomerOrder } from '../customer-order.entity';
import { GetOrdersByFilterParams } from './get-orders-by-filter';
import { Order } from '../order.entity';
import { OrderItem } from '../order-item.entity';

export abstract class OrdersRepository {
  abstract save(order: Order, customerOrder?: CustomerOrder): Promise<string>;
  abstract createOrderItem(orderItem: OrderItem): Promise<void>
  abstract deleteOrderItem(orderItem: OrderItem): Promise<void>
  abstract findById(orderId: string): Promise<Order | null>
  abstract findCustomerOrder(orderId: string): Promise<CustomerOrder | null>
  abstract findOrderItems(orderId: string): Promise<OrderItem[]>
  abstract update(order: Order): Promise<void>
  abstract findOrdersByFilter(filter: GetOrdersByFilterParams): Promise<Order[]>
}
