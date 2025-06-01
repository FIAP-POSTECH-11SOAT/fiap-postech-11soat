import { CreateOrderItemProps, OrderItem } from './order-item.entity';

import { randomUUID } from 'node:crypto';

describe('Order Item Entity', () => {

  const orderItemProps: CreateOrderItemProps = {
    orderId: randomUUID(),
    itemId: randomUUID(),
    price: 3.14,
    quantity: 1,
  }

  it('should create an order item', () => {
    const orderItem = OrderItem.create(orderItemProps);

    expect(orderItem).toBeDefined();
    expect(orderItem.orderId).toEqual(orderItemProps.orderId);
    expect(orderItem.itemId).toEqual(orderItemProps.itemId);
    expect(orderItem.price).toEqual(orderItemProps.price);
    expect(orderItem.quantity).toEqual(orderItemProps.quantity);
  });
});
