import { Decimal } from '@prisma/client/runtime/library';
import { OrderItem } from './order-item.entity';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { randomUUID } from 'node:crypto';

describe('Order Item Entity', () => {
  it('should create an order item', () => {
    const orderId = randomUUID();
    const itemId = randomUUID();
    const orderItem = OrderItem.create({
      orderId,
      itemId,
      price: new Decimal(3.14),
      quantity: 1,
    });

    expect(orderItem).toBeDefined();
    expect(orderItem.orderId).toEqual(orderId);
    expect(orderItem.itemId).toEqual(itemId);
    expect(orderItem.price.toNumber()).toEqual(3.14);
    expect(orderItem.quantity).toEqual(1);
  });

  it('should restore an order item', () => {
    const orderId = new UniqueEntityID(randomUUID());
    const itemId = new UniqueEntityID(randomUUID());
    const orderItem = new OrderItem(
      {
        orderId,
        itemId,
        price: new Decimal(3.14),
        quantity: 1,
      },
    );

    expect(orderItem).toBeDefined();
    expect(orderItem.orderId).toEqual(orderId);
    expect(orderItem.itemId).toEqual(itemId);
    expect(orderItem.price.toNumber()).toEqual(3.14);
    expect(orderItem.quantity).toEqual(1);
  });
});
