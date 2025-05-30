import { Test } from '@nestjs/testing';
import { ItemsRepository } from '../../ports/items.repository';
import { ActivateItemUseCase } from './activate-item.service';
import { Item } from '../../item.entity';
import { randomUUID } from 'node:crypto';

describe('Activate Item Use Case', () => {
  let service: ActivateItemUseCase;
  let itemsRepository: ItemsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ActivateItemUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<ActivateItemUseCase>(ActivateItemUseCase);
    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(itemsRepository).toBeDefined();
  });

  it('should activate an item', async () => {
    const id = randomUUID();
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(
      Item.create({
        id: id,
        name: 'Test Name',
        description: 'Test Description',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      }),
    );
    const result = await service.execute(id);
    expect(result.deletedAt).toEqual(null);
  });

  it('should throw an error when item not found', async () => {
    const id = randomUUID();
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(null);
    await expect(service.execute(id)).rejects.toThrow(
      new Error('Item not found'),
    );
  });

  it('should throw an error when item is not deleted', async () => {
    const id = randomUUID();
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(
      Item.create({
        id: id,
        name: 'Test Name',
        description: 'Test Description',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
    await expect(service.execute(id)).rejects.toThrow(
      new Error('Item not deleted'),
    );
  });
});
