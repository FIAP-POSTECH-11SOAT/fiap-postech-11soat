import { CustomerOrder } from 'src/order/domain/customer-order.entity';
import { Order } from 'src/order/domain/order.entity'
import { OrderItem } from 'src/order/domain/order-item.entity';
import { OrdersRepository } from 'src/order/domain/ports/orders.repository';

export class InMemoryOrdersRepository implements OrdersRepository {
  orders: Order[] = [];
  orderItems: OrderItem[] = [];
  customerOrders: CustomerOrder[] = [];

  async save(order: Order, customerOrder?: CustomerOrder): Promise<string> {
    this.orders.push(order);
    if (customerOrder) {
      this.customerOrders.push(customerOrder);
    }
    return order.id;
  }

  async createOrderItem(orderItem: OrderItem): Promise<void> {
    this.orderItems.push(orderItem);
    const orderIndex = this.orders.findIndex(order => order.id === orderItem.orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].total = this.orders[orderIndex].total.add(orderItem.price.toNumber() * orderItem.quantity);
    }
  }

  async deleteOrderItem(orderItem: OrderItem): Promise<void> {
    const index = this.orderItems.findIndex(item => (item.itemId.toString() === orderItem.itemId.toString()) && (item.orderId.toString() === orderItem.orderId.toString()));
    const removedOrderItem = this.orderItems[index];
    this.orderItems.splice(index, 1);

    const orderIndex = this.orders.findIndex(order => order.id === removedOrderItem.orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].total = this.orders[orderIndex].total.sub((removedOrderItem.price.toNumber() * removedOrderItem.quantity));
    }
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = this.orders.find(order => order.id === orderId);
    if (!order) return null;
    return order;
  }

  async findCustomerOrder(orderId: string): Promise<CustomerOrder | null> {
    const customerOrder = this.customerOrders.find(customerOrder => customerOrder.orderId === orderId);
    return customerOrder || null;
  }

  async findOrderItems(orderId: string): Promise<OrderItem[]> {
    const orderItems = this.orderItems.filter(item => item.orderId === orderId);
    return orderItems;
  }

  async update(order: Order): Promise<void> {
    const index = this.orders.findIndex((o) => o.id === order.id);
    if (index >= 0) this.orders[index] = order;
  }
}
