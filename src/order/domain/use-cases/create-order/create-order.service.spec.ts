import { CreateOrderUseCase } from './create-order.service';
import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';
import { randomUUID } from 'crypto';

describe('Create Order Use Case', () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    useCase = new CreateOrderUseCase(inMemoryOrdersRepository);
  });

  it('should be able to create an order with customer id', async () => {
    const customerId = randomUUID();
    const orderId = await useCase.execute(customerId);

    expect(inMemoryOrdersRepository.customerOrders).toHaveLength(1);
    expect(inMemoryOrdersRepository.customerOrders[0].customerId).toEqual(customerId);
    expect(inMemoryOrdersRepository.customerOrders[0].orderId).toEqual(orderId);
    expect(inMemoryOrdersRepository.orders).toHaveLength(1);
    expect(inMemoryOrdersRepository.orders[0].id).toEqual(orderId);
    expect(inMemoryOrdersRepository.orders[0].status).toEqual('AWAITING');
    expect(inMemoryOrdersRepository.orders[0].total).toEqual(0);
  });

  it('should be able to create an order without customer id', async () => {
    const orderId = await useCase.execute();

    expect(inMemoryOrdersRepository.customerOrders).toHaveLength(0);
    expect(inMemoryOrdersRepository.orders).toHaveLength(1);
    expect(inMemoryOrdersRepository.orders[0].id).toEqual(orderId);
    expect(inMemoryOrdersRepository.orders[0].status).toEqual('AWAITING');
    expect(inMemoryOrdersRepository.orders[0].total).toEqual(0);
  });
});
