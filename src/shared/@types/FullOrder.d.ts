import { Order } from "src/order/domain/order.entity";

export type FullOrder = {
  customerId: string | null;
  items: { itemId: string, quantity: number, price: Decimal }[];
  orderDetails: Order;
}