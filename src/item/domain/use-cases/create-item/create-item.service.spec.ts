import { randomUUID } from 'node:crypto';
import { Category } from '../../../../category/domain/category.entity';
import { CreateItemProps, Item } from '../../item.entity';
import { CreateItemUseCase } from './create-item.service';
import { UniqueEntityID } from '../../../../shared/entities/unique-entity-id';
import { ItemsRepository } from '../../ports/items.repository';
import { CategoriesRepository } from '../../../../category/domain/ports/categories.repository';
import { Test } from '@nestjs/testing';

describe('Create Item Use Case', () => {
  let itemsRepository: ItemsRepository;
  let categoriesRepository: CategoriesRepository;
  let sut: CreateItemUseCase;

  const createItemProps: CreateItemProps = {
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
        CreateItemUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            create: jest.fn(),
            findByName: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CategoriesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = moduleRef.get<CreateItemUseCase>(CreateItemUseCase);
    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
    categoriesRepository =
      moduleRef.get<CategoriesRepository>(CategoriesRepository);
  });
  it('should create an item', async () => {
    jest
      .spyOn(categoriesRepository, 'findById')
      .mockResolvedValue(
        Category.create(
          { id: createItemProps.categoryId, name: 'Test Category' }
        ),
      );
    const item = await sut.execute(createItemProps);
    expect(item).toBeDefined();
    expect(item.categoryId).toBe(createItemProps.categoryId);
  });
  it('should create an item without image', async () => {
    jest
      .spyOn(categoriesRepository, 'findById')
      .mockResolvedValue(
        Category.create(
          { id: createItemProps.categoryId, name: 'Test Category' }
        ),
      );
    delete createItemProps.image;
    const item = await sut.execute(createItemProps);
    expect(item.image).toBe(null);
  });
  it('should throw an error if item with this name already exists', async () => {
    jest
      .spyOn(itemsRepository, 'findByName')
      .mockResolvedValue(Item.create(createItemProps));

    await expect(() => sut.execute(createItemProps)).rejects.toThrow(
      new Error('Item with this name already exists'),
    );
  });
  it('should throw an error if category does not exist', async () => {
    jest.spyOn(categoriesRepository, 'findById').mockResolvedValue(null);

    await expect(() => sut.execute(createItemProps)).rejects.toThrow(
      new Error('Invalid category'),
    );
  });
  it('should throw an error if category is deleted', async () => {
    //mock category repository to return deleted
    jest
      .spyOn(categoriesRepository, 'findById')
      .mockResolvedValue(
        Category.create(
          { id: createItemProps.categoryId, name: 'Test Category', deletedAt: new Date() }
        ),
      );

    await expect(() => sut.execute(createItemProps)).rejects.toThrow(
      new Error('Invalid category'),
    );
  });
});
