import { Test } from '@nestjs/testing';
import { ItemsRepository } from '../../ports/items.repository';
import { GetDeletedItemsUseCase } from './get-deleted-items.service';
import { Item } from '../../item.entity';
import { randomUUID } from 'node:crypto';

describe('Get Deleted Items Use Case', () => {
  let service: GetDeletedItemsUseCase;
  let itemsRepository: ItemsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetDeletedItemsUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            findDeleted: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<GetDeletedItemsUseCase>(GetDeletedItemsUseCase);
    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get deleted items', async () => {
    jest.spyOn(itemsRepository, 'findDeleted').mockResolvedValue([
      Item.create({
        name: 'Test Name',
        description: 'Test Description',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      }),
    ]);
    const items = await service.execute();
    expect(items.length).toBe(1);
    expect(items[0].name).toBe('Test Name');
    expect(items[0].deletedAt).toBeDefined();
  });
});
