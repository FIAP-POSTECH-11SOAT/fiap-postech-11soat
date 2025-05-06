import { Decimal } from '@prisma/client/runtime/library';
import { Order } from './order.entity';
import { OrderStatus } from '@prisma/client';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { randomUUID } from 'node:crypto';

describe('Order Entity', () => {
  it('should create an order', () => {
    const order = Order.create({
      total: new Decimal(3.14),
      status: OrderStatus.AWAITING
    });

    expect(order).toBeDefined();
    expect(order.total.toNumber()).toEqual(3.14);
    expect(order.status).toEqual(OrderStatus.AWAITING);
  });

  it('should restore an order', () => {
    const id = randomUUID();
    const order = new Order(
      {
        total: new Decimal(3.14),
        status: OrderStatus.AWAITING,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(id),
    );

    expect(order).toBeDefined();
    expect(order.total.toNumber()).toEqual(3.14);
    expect(order.status).toEqual(OrderStatus.AWAITING);
    expect(order.id.toString()).toBe(id);
  });
});
