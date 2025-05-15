import { Decimal } from '@prisma/client/runtime/library';
import { DeleteOrderItemPort } from '../../ports/delete-order-item.port';
import { Injectable } from '@nestjs/common';
import { ItemsRepository } from 'src/item/domain/ports/items.repository';
import { OrderItem } from '../../order-item.entity';
import { OrdersRepository } from '../../ports/orders.repository';

@Injectable()
export class DeleteOrderItemUseCase implements DeleteOrderItemPort {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly itemsRepository: ItemsRepository,
  ) { }

  async execute(orderId: string, itemId: string): Promise<void> {
    const item = await this.itemsRepository.findById(itemId);
    if (!item) throw new Error('Invalid item');

    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Invalid order');
    if (order.status !== 'AWAITING') throw new Error('This order cannot be updated')

    const orderItem = OrderItem.create({ orderId, itemId, quantity: 0, price: new Decimal(0) });
    await this.ordersRepository.deleteOrderItem(orderItem);
  }
}
