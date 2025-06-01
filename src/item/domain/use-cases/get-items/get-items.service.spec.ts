import { GetItemsUseCase } from './get-items.service';
import { Item } from '../../item.entity';
import { randomUUID } from 'node:crypto';
import { ItemsRepository } from '../../ports/items.repository';
import { Test } from '@nestjs/testing';

describe('GetItemsService', () => {
  let service: GetItemsUseCase;
  let itemsRepository: ItemsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetItemsUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<GetItemsUseCase>(GetItemsUseCase);
    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get any items', async () => {
    jest.spyOn(itemsRepository, 'findAll').mockResolvedValue([]);
    const items = await service.execute();
    expect(items.length).toBe(0);
  });

  it('should get items', async () => {
    jest.spyOn(itemsRepository, 'findAll').mockResolvedValue([
      Item.create({
        name: 'Test Name',
        description: 'Test Description',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Item.create({
        name: 'Test Name 2',
        description: 'Test Description 2',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]);
    const items = await service.execute();
    expect(items.length).toBe(2);
    expect(items[0].name).toBe('Test Name');
    expect(items[1].name).toBe('Test Name 2');
  });
});
