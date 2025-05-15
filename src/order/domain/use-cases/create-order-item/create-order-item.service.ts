import { CreateOrderItemProps, OrderItem } from '../../order-item.entity';

import { CreateOrderItemPort } from '../../ports/create-order-item.port';
import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../../../item/domain/ports/items.repository';
import { OrdersRepository } from '../../ports/orders.repository';

@Injectable()
export class CreateOrderItemUseCase implements CreateOrderItemPort {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly itemsRepository: ItemsRepository,
  ) { }

  async execute({ orderId, itemId, quantity, price }: CreateOrderItemProps): Promise<void> {
    if (quantity <= 0) throw new Error('Invalid quantity');
    if (price.lt(0)) throw new Error('Invalid price');

    const item = await this.itemsRepository.findById(itemId);
    if (!item || item.deletedAt) throw new Error('Invalid item');

    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Invalid order');
    if (order.status !== 'AWAITING') throw new Error('This order cannot be updated')

    const items = await this.ordersRepository.findOrderItems(orderId);
    if (items.some(existingItem => existingItem.itemId === itemId)) throw new Error('The order already has this item');

    const orderItem = OrderItem.create({ orderId, itemId, quantity, price });
    await this.ordersRepository.createOrderItem(orderItem);
  }
}
