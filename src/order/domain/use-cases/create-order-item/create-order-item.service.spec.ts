import { CreateOrderItemProps } from '../../order-item.entity';
import { CreateOrderItemUseCase } from './create-order-item.service';
import { InMemoryItemsRepository } from 'src/item/persistence/in-memory/in-memory-items.repository';
import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';
import { Item } from 'src/item/domain/item.entity';
import { Order } from '../../order.entity';
import { randomUUID } from 'crypto';

describe('Create Order Item Use Case', () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let inMemoryItemsRepository: InMemoryItemsRepository;
  let useCase: CreateOrderItemUseCase;

  const orderId = randomUUID();
  const itemId = randomUUID();

  const createOrderItemProps: CreateOrderItemProps = {
    orderId,
    itemId,
    quantity: 1,
    price: 10
  }

  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryItemsRepository = new InMemoryItemsRepository();

    jest.spyOn(inMemoryOrdersRepository, 'findById').mockResolvedValue(Order.create({
      id: orderId,
      total: 0,
      status: 'AWAITING'
    }));
    jest.spyOn(inMemoryItemsRepository, 'findById').mockResolvedValue(Item.create({
      id: itemId,
      name: 'Test Item',
      price: 10,
      description: 'Test Description',
      categoryId: randomUUID()
    }));
    useCase = new CreateOrderItemUseCase(inMemoryOrdersRepository, inMemoryItemsRepository);
  });

  it('should be able to create an order item', async () => {
    await useCase.execute(createOrderItemProps);

    expect(inMemoryOrdersRepository.orderItems).toHaveLength(1);
    expect(inMemoryOrdersRepository.orderItems[0].itemId).toEqual(createOrderItemProps.itemId);
    expect(inMemoryOrdersRepository.orderItems[0].orderId).toEqual(createOrderItemProps.orderId);
    expect(inMemoryOrdersRepository.orderItems[0].price).toEqual(createOrderItemProps.price);
    expect(inMemoryOrdersRepository.orderItems[0].quantity).toEqual(createOrderItemProps.quantity);
  });

  it('should throw an error if item does not exist', async () => {
    jest
      .spyOn(inMemoryItemsRepository, 'findById')
      .mockResolvedValue(null);
    await expect(() => useCase.execute(createOrderItemProps)).rejects.toThrow(
      new Error('Invalid item')
    );
  });

  it('should throw an error if order does not exist', async () => {
    jest
      .spyOn(inMemoryOrdersRepository, 'findById')
      .mockResolvedValue(null);
    await expect(() => useCase.execute(createOrderItemProps)).rejects.toThrow(
      new Error('Invalid order')
    );
  });

  it('should throw an error if quantity is equal to 0', async () => {
    const invalidCreateOrderItemProps = { ...createOrderItemProps, quantity: 0 };
    await expect(() => useCase.execute(invalidCreateOrderItemProps)).rejects.toThrow(
      new Error('Invalid quantity')
    );
  });

  it('should throw an error if quantity is lower than 0', async () => {
    const invalidCreateOrderItemProps = { ...createOrderItemProps, quantity: -1 };
    await expect(() => useCase.execute(invalidCreateOrderItemProps)).rejects.toThrow(
      new Error('Invalid quantity')
    );
  });
});
