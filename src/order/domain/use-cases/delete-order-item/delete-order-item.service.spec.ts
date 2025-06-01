import { CreateItemProps, Item } from 'src/item/domain/item.entity';
import { CreateOrderItemProps, OrderItem } from '../../order-item.entity';
import { CreateOrderProps, Order } from '../../order.entity';

import { DeleteOrderItemUseCase } from './delete-order-item.service';
import { InMemoryItemsRepository } from 'src/item/persistence/in-memory/in-memory-items.repository';
import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';
import { randomUUID } from 'crypto';

describe('Delete Order Item Use Case', () => {
  let inMemoryOrdersRepository: InMemoryOrdersRepository;
  let inMemoryItemsRepository: InMemoryItemsRepository;
  let useCase: DeleteOrderItemUseCase;

  const orderId = randomUUID();
  const itemId = randomUUID();

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
      price: 10.00,
      description: 'Test Description',
      categoryId: randomUUID()
    }));
    useCase = new DeleteOrderItemUseCase(inMemoryOrdersRepository, inMemoryItemsRepository);
  });

  it('should be able to delete an order item', async () => {
    const orderProps: CreateOrderProps = {
      total: 0,
      status: 'AWAITING',
    }
    const order = Order.create(orderProps);
    await inMemoryOrdersRepository.save(order);

    const itemProps: CreateItemProps = {
      name: 'Test Item',
      description: 'Test Description',
      price: 20,
      categoryId: randomUUID(),
    }
    const item = Item.create(itemProps);
    await inMemoryItemsRepository.save(item);

    const orderItemProps: CreateOrderItemProps = {
      orderId: order.id,
      itemId: item.id,
      price: 20,
      quantity: 1
    }
    const orderItem = OrderItem.create(orderItemProps);
    await inMemoryOrdersRepository.createOrderItem(orderItem);

    expect(inMemoryOrdersRepository.orderItems).toHaveLength(1);
    expect(inMemoryOrdersRepository.orderItems[0].orderId).toEqual(orderItemProps.orderId);
    expect(inMemoryOrdersRepository.orderItems[0].itemId).toEqual(orderItemProps.itemId);
    expect(inMemoryOrdersRepository.orderItems[0].quantity).toEqual(orderItemProps.quantity);
    expect(inMemoryOrdersRepository.orderItems[0].price).toEqual(orderItemProps.price);
    expect(inMemoryOrdersRepository.orders[0].total).toEqual(orderItemProps.price * orderItemProps.quantity);

    await useCase.execute(order.id, item.id);

    expect(inMemoryOrdersRepository.orderItems).toHaveLength(0);
    expect(inMemoryOrdersRepository.orders[0].total).toEqual(0);
  });

  it('should throw an error if the order does not exist', async () => {
    jest
      .spyOn(inMemoryOrdersRepository, 'findById')
      .mockResolvedValue(null);
    await expect(useCase.execute(itemId, orderId)).rejects.toThrow(
      new Error('Invalid order')
    );
  });

  it('should throw an error if the item does not exist', async () => {
    jest
      .spyOn(inMemoryItemsRepository, 'findById')
      .mockResolvedValue(null);
    await expect(useCase.execute(itemId, orderId)).rejects.toThrow(
      new Error('Invalid item')
    );
  });
});
