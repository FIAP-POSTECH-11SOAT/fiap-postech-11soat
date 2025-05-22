import { randomUUID } from 'node:crypto';
import { Item } from '../../item.entity';
import { ItemsRepository } from '../../ports/items.repository';
import { Test } from '@nestjs/testing';
import { UpdateItemUseCase } from './update-item.service';
import { UpdateItemProps } from '../../ports/update-item.port';
import { CategoriesRepository } from '../../../../category/domain/ports/categories.repository';
import { Category } from '../../../../category/domain/category.entity';

describe('Update Item Use Case', () => {
  let service: UpdateItemUseCase;
  let itemsRepository: ItemsRepository;
  let categoriesRepository: CategoriesRepository;

  const item = Item.create({
    id: randomUUID(),
    name: 'Test Name',
    description: 'Test Description',
    price: 10,
    categoryId: randomUUID(),
    image: 'Test Image',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateItemUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(item),
            update: jest.fn(),
            findByName: jest.fn(),
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

    service = moduleRef.get<UpdateItemUseCase>(UpdateItemUseCase);
    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
    categoriesRepository =
      moduleRef.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(itemsRepository).toBeDefined();
    expect(categoriesRepository).toBeDefined();
  });

  it('should update an item', async () => {
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(item);

    const updateItemProps: UpdateItemProps = {
      name: 'Updated Name',
      description: 'Updated Description',
      price: 20,
      image: '/public/updated.png',
    };
    const lastUpdatedAt = item.updatedAt;

    jest.spyOn(itemsRepository, 'findByName').mockResolvedValue(null);

    const itemUpdated = await service.execute(item.id, updateItemProps);

    expect(itemUpdated.name).toBe('Updated Name');
    expect(itemUpdated.description).toBe('Updated Description');
    expect(itemUpdated.price).toBe(20);
    expect(itemUpdated.image).toBe('/public/updated.png');
    expect(itemUpdated.updatedAt).not.toBe(lastUpdatedAt);
  });

  it('should throw an error when trying to update a non-existent item', async () => {
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(null);

    const updateItemProps: UpdateItemProps = {
      name: 'Updated Name',
      description: 'Updated Description',
      price: 20,
      image: null,
    };

    await expect(
      service.execute(randomUUID(), updateItemProps),
    ).rejects.toThrow(new Error('Item not found'));
  });
  it('should throw an error when trying to update a item with non-existent category', async () => {
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(item);

    const updateItemProps: UpdateItemProps = {
      name: 'Updated Name',
      description: 'Updated Description',
      price: 20,
      image: null,
      categoryId: randomUUID(),
    };

    jest.spyOn(categoriesRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute(item.id, updateItemProps)).rejects.toThrow(
      new Error('Category not found'),
    );
  });
  it('should throw an error when trying to update an item with existing name', async () => {
    jest.spyOn(itemsRepository, 'findById').mockResolvedValue(item);

    const updateItemProps: UpdateItemProps = {
      name: 'Updated Name',
    };

    jest.spyOn(itemsRepository, 'findByName').mockResolvedValue(
      Item.create({
        id: randomUUID(),
        name: 'Updated Name',
        description: 'Test Description',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(service.execute(item.id, updateItemProps)).rejects.toThrow(
      new Error('Item with this name already exists'),
    );
  });
  it('should throw an error when trying to update an item with deleted category', async () => {
    const updateItemProps: UpdateItemProps = {
      categoryId: randomUUID(),
    };

    jest.spyOn(categoriesRepository, 'findById').mockResolvedValue(
      Category.create({
        id: updateItemProps.categoryId,
        name: 'Test Category',
        deletedAt: new Date(),
      }),
    );

    await expect(service.execute(item.id, updateItemProps)).rejects.toThrow(
      new Error('Invalid category'),
    );
  });
});
