import { CreateOrderProps, Order } from '../../order.entity';

import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';
import { InMemoryPaymentsRepository } from 'src/payments/persistence/in-memory/in-memory-payments.repository';
import { UpdateStatusUseCase } from './update-status.service';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let sut: UpdateStatusUseCase;

describe('Update Order Status Use Case', () => {
  const orderProps: CreateOrderProps = {
    total: 0,
    status: 'AWAITING',
  }
  const order = Order.create(orderProps);

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    sut = new UpdateStatusUseCase(inMemoryOrdersRepository, inMemoryPaymentsRepository);
    await inMemoryOrdersRepository.save(order);
    jest
      .spyOn(inMemoryOrdersRepository, 'findById')
      .mockResolvedValue(order);
  });

  it('should be able to edit the status of an order', async () => {
    await sut.execute(order.id, 'AWAITING_PAYMENT');
    expect(inMemoryOrdersRepository.orders[0].status).toBe('AWAITING_PAYMENT');
  });

  it('should throw an error if status is invalid', async () => {
    await expect(() => sut.execute(order.id, 'PICKUPED')).rejects.toThrow(
      new Error('Invalid status transition')
    );
  });
});
