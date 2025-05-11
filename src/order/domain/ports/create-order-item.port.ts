import { CreateOrderItemProps } from '../order-item.entity';

export abstract class CreateOrderItemPort {
  abstract execute(orderItem: CreateOrderItemProps): Promise<void>
}
