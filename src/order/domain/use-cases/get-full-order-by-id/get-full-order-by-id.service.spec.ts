import { CreateOrderProps, Order } from '../../order.entity';

import { GetFullOrderByIdUseCase } from './get-full-order-by-id.service';
import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: GetFullOrderByIdUseCase;

describe('Get Orders Use Case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new GetFullOrderByIdUseCase(inMemoryOrdersRepository);
  });

  it('should be able to fetch an order', async () => {
    const orderProps: CreateOrderProps = {
      total: 0,
      status: 'AWAITING',
    }
    const order = Order.create(orderProps);
    await inMemoryOrdersRepository.save(order);

    const fetchedOrder = await sut.execute(order.id);
    expect(fetchedOrder).toBeDefined();

    expect(inMemoryOrdersRepository.orders).toHaveLength(1);
  });
});
