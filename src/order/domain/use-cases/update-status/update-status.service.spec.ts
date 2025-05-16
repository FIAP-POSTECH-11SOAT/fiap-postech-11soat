import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';
import { UpdateStatusUseCase } from './update-status.service';
import { CreateOrderProps, Order } from '../../order.entity';
import { Decimal } from '@prisma/client/runtime/library';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: UpdateStatusUseCase;

describe('Update Order Status Use Case', () => {
  const orderProps: CreateOrderProps = {
    total: new Decimal(0),
    status: 'AWAITING',
  }
  const order = Order.create(orderProps);

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new UpdateStatusUseCase(inMemoryOrdersRepository);
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
      new Error('Invalid state transition')
    );
  });
});
