import { Injectable } from '@nestjs/common';
import { ItemsRepository } from 'src/item/domain/ports/items.repository';
import { OrdersRepository } from '../ports/orders.repository';

type DeleteOrderItemUseCaseInput = {
  orderId: string;
  itemId: string;
};

@Injectable()
export class DeleteOrderItemUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly itemsRepository: ItemsRepository,
  ) { }

  async execute({ orderId, itemId }: DeleteOrderItemUseCaseInput): Promise<void> {
    const item = await this.itemsRepository.findById(itemId);
    if (!item) throw new Error('Invalid item');

    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Invalid order');

    if (!order.items.some(existingItem => existingItem.itemId === itemId)) {
      throw new Error('The order does not have this item');
    }
    await this.ordersRepository.deleteOrderItem(orderId, itemId);
  }
}
