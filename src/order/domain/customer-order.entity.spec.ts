import { CreateCustomerOrderProps, CustomerOrder } from './customer-order.entity';

import { randomUUID } from 'node:crypto';

describe('Customer Order Entity', () => {

  const customerOrderProps: CreateCustomerOrderProps = {
    orderId: randomUUID(),
    customerId: randomUUID(),
  }

  it('should create a customer order', () => {
    const customerOrder = CustomerOrder.create(customerOrderProps);

    expect(customerOrder).toBeDefined();
    expect(customerOrder.orderId).toEqual(customerOrderProps.orderId);
    expect(customerOrder.customerId).toEqual(customerOrderProps.customerId);
  });
});
