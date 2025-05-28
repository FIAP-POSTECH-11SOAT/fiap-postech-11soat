import { CreateOrderProps, Order } from './order.entity';

describe('Order Entity', () => {

  const orderProps: CreateOrderProps = {
    total: 3.14,
    status: 'AWAITING',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should create an order', () => {
    const order = Order.create(orderProps);

    expect(order).toBeDefined();
    expect(order.total).toEqual(orderProps.total);
    expect(order.status).toEqual(orderProps.status);
    expect(order.createdAt).toEqual(orderProps.createdAt);
    expect(order.updatedAt).toEqual(orderProps.updatedAt);
  });
});
