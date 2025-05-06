import { Decimal } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../../item/domain/ports/items.repository';
import { OrderItem } from '../order-item.entity';
import { OrdersRepository } from '../ports/orders.repository';

type CreateOrderItemUseCaseInput = {
  orderId: string;
  itemId: string;
  quantity: number;
  price: Decimal;
};

@Injectable()
export class CreateOrderItemUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly itemsRepository: ItemsRepository,
  ) { }

  async execute({ orderId, itemId, quantity, price }: CreateOrderItemUseCaseInput): Promise<void> {
    if (quantity <= 0) throw new Error('Invalid quantity');
    if (price.lt(0)) throw new Error('Invalid price');

    const item = await this.itemsRepository.findById(itemId);
    if (!item || item.deletedAt) throw new Error('Invalid item');

    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Invalid order');

    if(order.items.some(existingItem => existingItem.itemId === itemId)) throw new Error('The order already has this item'); 

    const orderItem = OrderItem.create({ orderId, itemId, quantity, price });
    await this.ordersRepository.createOrderItem(orderItem);
  }
}
