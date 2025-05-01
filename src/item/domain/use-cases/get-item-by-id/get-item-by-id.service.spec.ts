import { randomUUID } from 'node:crypto';
import { InMemoryItemsRepository } from '../../../persistence/in-memory/in-memory-items.repository';
import { GetItemByIdUseCase } from './get-item-by-id.service';
import { CreateItemProps, Item } from '../../item.entity';

describe('Get Item by ID Use Case', () => {
  let inMemoryItemsRepository: InMemoryItemsRepository;
  let sut: GetItemByIdUseCase;

  const createItemProps: CreateItemProps = {
    id: randomUUID(),
    name: 'Test Name',
    description: 'Test Description',
    price: 10,
    categoryId: randomUUID(),
    image: 'Test Image',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    inMemoryItemsRepository = new InMemoryItemsRepository();
    sut = new GetItemByIdUseCase(inMemoryItemsRepository);
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });

  it('should get an item by id', async () => {
    jest
      .spyOn(inMemoryItemsRepository, 'findById')
      .mockResolvedValue(Item.create(createItemProps));
    const item = await sut.execute(createItemProps.id as string);
    expect(item).toBeDefined();
  });

  it('should throw an error if item does not exist', async () => {
    jest.spyOn(inMemoryItemsRepository, 'findById').mockResolvedValue(null);
    await expect(() =>
      sut.execute(createItemProps.id as string),
    ).rejects.toThrow(new Error('Item not found'));
  });
});
