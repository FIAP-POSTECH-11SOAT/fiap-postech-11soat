import { OrderStatus } from 'src/shared/@types/OrderStatus';

export abstract class UpdateStatusPort {
  abstract execute(orderId: string, status: OrderStatus): Promise<void>
}
