import { OrderItem } from "src/order/domain/order-item.entity";
import { Order } from "src/order/domain/order.entity";

export type FullOrder = {
  customerId: string | null;
  items: OrderItem[];
  orderDetails: Order;
}