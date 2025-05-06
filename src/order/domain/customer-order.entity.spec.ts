import { CustomerOrder } from './customer-order.entity';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { randomUUID } from 'node:crypto';

describe('Customer Order Entity', () => {
  it('should create a customer order', () => {
    const orderId = randomUUID();
    const customerId = randomUUID();
    const customerOrder = CustomerOrder.create({
      orderId,
      customerId,
    });

    expect(customerOrder).toBeDefined();
    expect(customerOrder.orderId).toEqual(orderId);
    expect(customerOrder.customerId).toEqual(customerId);
  });

  it('should restore a customer order', () => {
    const orderId = new UniqueEntityID(randomUUID());
    const customerId = new UniqueEntityID(randomUUID());
    const customerOrder = new CustomerOrder(
      {
        orderId,
        customerId,
      },
    );

    expect(customerOrder).toBeDefined();
    expect(customerOrder.orderId).toEqual(orderId);
    expect(customerOrder.customerId).toEqual(customerId);
  });
});
