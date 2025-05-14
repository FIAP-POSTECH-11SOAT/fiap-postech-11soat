import { CreateOrderUseCase } from './create-order.service';
import { Decimal } from '@prisma/client/runtime/library';
import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';
import { randomUUID } from 'crypto';

describe('Create Order Use Case', () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    useCase = new CreateOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to create an order', async () => {
    const customerId = randomUUID();
    const orderId = await useCase.execute(customerId);

    expect(inMemoryOrdersRepository.customerOrders[0].customerId).toEqual(customerId);
    expect(inMemoryOrdersRepository.customerOrders[0].orderId).toEqual(orderId);
    expect(inMemoryOrdersRepository.orders).toHaveLength(1);
    expect(inMemoryOrdersRepository.orders[0].id).toEqual(orderId);
    expect(inMemoryOrdersRepository.orders[0].status).toEqual('AWAITING');
    expect(inMemoryOrdersRepository.orders[0].total).toEqual(new Decimal(0));
  });
});
