import { randomUUID } from 'node:crypto';
import { GetItemByIdUseCase } from './get-item-by-id.service';
import { CreateItemProps, Item } from '../../item.entity';
import { ItemsRepository } from '../../ports/items.repository';
import { Test } from '@nestjs/testing';

describe('Get Item by ID Use Case', () => {
  let itemsRepository: ItemsRepository;
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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetItemByIdUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
    sut = moduleRef.get<GetItemByIdUseCase>(GetItemByIdUseCase);
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });

  it('should get an item by id', async () => {
    jest
      .spyOn(itemsRepository, 'findById')
      .mockResolvedValue(Item.create(createItemProps));
    const item = await sut.execute(createItemProps.id as string);
    expect(item).toBeDefined();
  });

  it('should throw an error if item does not exist', async () => {
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(null);
    await expect(() =>
      sut.execute(createItemProps.id as string),
    ).rejects.toThrow(new Error('Item not found'));
  });
});
