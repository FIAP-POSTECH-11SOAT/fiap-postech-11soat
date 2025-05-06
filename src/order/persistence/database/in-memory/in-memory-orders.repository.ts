import { CustomerOrder } from 'src/order/domain/customer-order.entity';
import { FullOrder } from 'src/shared/@types/FullOrder';
import { Order } from 'src/order/domain/order.entity'
import { OrderItem } from '@prisma/client';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';

export class InMemoryOrdersRepository implements OrdersRepository {
  orders: Order[] = [];
  orderItems: OrderItem[] = [];
  customerOrders: CustomerOrder[] = [];

  async save(order: Order, customerId: string): Promise<string> {
    this.orders.push(order);
    this.customerOrders.push(CustomerOrder.create({ customerId, orderId: order.id }));
    return order.id;
  }

  async findById(orderId: string): Promise<FullOrder | null> {
    const order = this.orders.find(order => order.id === orderId);
    if (!order) return null;

    const orderItems = this.orderItems.filter(item => item.orderId === orderId);
    const customerOrder = this.customerOrders.find(customerOrder => customerOrder.orderId === orderId);

    return {
      orderDetails: order,
      items: orderItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price,
      })),
      customerId: customerOrder?.customerId || null,
    };
  }

  async createOrderItem(orderItem: OrderItem): Promise<void> {
    this.orderItems.push(orderItem);
    this.orders.map(order => {
      if (order.id === orderItem.orderId) {
        order.total.add((orderItem.price.toNumber() * orderItem.quantity));
      }
    });
  }

  async deleteOrderItem(itemId: string, orderId: string): Promise<void> {
    const index = this.orderItems.findIndex(item => item.itemId === itemId && item.orderId === orderId);
    if (index !== -1) {
      const orderItem = this.orderItems[index];
      this.orderItems.splice(index, 1);

      this.orders.map(order => {
        if (order.id === orderId) {
          order.total.sub((orderItem.price.toNumber() * orderItem.quantity));
        }
      });
    }
  }
}
