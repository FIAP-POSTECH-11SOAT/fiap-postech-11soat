import { Order } from '../order.entity';
import { OrderStatus } from 'src/shared/@types/OrderStatus';

export interface GetOrdersByFilterParams {
  orderId?: string;
  status?: OrderStatus;
  customerId?: string;
  itemId?: string;
  page?: number;
  pageSize?: number;
}

export abstract class GetOrdersByFilterPort {
  abstract execute(filter: GetOrdersByFilterParams): Promise<Order[]>
}
