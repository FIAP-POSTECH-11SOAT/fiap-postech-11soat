//

import { Test } from '@nestjs/testing';
import { ItemsRepository } from '../../ports/items.repository';
import { DeleteItemUseCase } from './delete-item.service';
import { randomUUID } from 'node:crypto';
import { CreateItemProps, Item } from '../../item.entity';

describe('Delete Item Use Case', () => {
  let service: DeleteItemUseCase;
  let itemsRepository: ItemsRepository;

  const id = randomUUID();

  // It's good practice to recreate the item for each test if its state can change,
  // or ensure its state is reset. For this example, we'll define it once.
  const itemProps: CreateItemProps = {
    id: id,
    name: 'Test Name',
    description: 'Test Description',
    price: 10,
    categoryId: randomUUID(),
    image: 'Test Image',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteItemUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<DeleteItemUseCase>(DeleteItemUseCase);
    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(itemsRepository).toBeDefined();
  });

  it('should delete an item', async () => {
    //mock active result from find by id
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(
      Item.create({
        ...itemProps,
        deletedAt: null,
      }),
    );
    const item = await service.execute(id);
    expect(item).toBeDefined();
    expect(item.deletedAt).not.toBeNull();
  });

  it('should throw an error when item does not exist', async () => {
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(null);
    await expect(service.execute(id)).rejects.toThrow(
      new Error('Item not found'),
    );
  });

  it('should throw an error when item is deleted', async () => {
    //mock deleted result from find by id
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(
      Item.create({
        ...itemProps,
        deletedAt: new Date(),
      }),
    );
    await expect(service.execute(id)).rejects.toThrow(
      new Error('Item already deleted'),
    );
  });
});
