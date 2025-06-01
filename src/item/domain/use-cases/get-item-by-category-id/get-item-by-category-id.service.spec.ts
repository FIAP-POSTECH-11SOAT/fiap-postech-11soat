import { randomUUID } from 'node:crypto';
import { GetItemByCategoryIdUseCase } from './get-item-by-category-id.service';
import { Item } from '../../item.entity';
import { Category } from '../../../../category/domain/category.entity';
import { ItemsRepository } from '../../ports/items.repository';
import { CategoriesRepository } from '../../../../category/domain/ports/categories.repository';
import { Test } from '@nestjs/testing';

describe('Get Item by Category Id Use Case', () => {
  let sut: GetItemByCategoryIdUseCase;
  let itemsRepository: ItemsRepository;
  let categoriesRepository: CategoriesRepository;

  const category = Category.create({ name: 'Test Category' });

  const item = Item.create({
    name: 'Test Name',
    description: 'Test Description',
    price: 10,
    categoryId: category.id,
    image: 'Test Image',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetItemByCategoryIdUseCase,
        {
          provide: ItemsRepository,
          useValue: {
            findByCategoryId: jest.fn(),
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

    sut = moduleRef.get(GetItemByCategoryIdUseCase);

    itemsRepository = moduleRef.get<ItemsRepository>(ItemsRepository);
    categoriesRepository =
      moduleRef.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should get items by category', async () => {
    jest.spyOn(categoriesRepository, 'findById').mockResolvedValue(category);
    jest.spyOn(itemsRepository, 'findByCategoryId').mockResolvedValue([item]);
    const items: Item[] = await sut.execute(category.id);
    expect(items.length).toBe(1);
  });

  it('should get any items', async () => {
    jest.spyOn(categoriesRepository, 'findById').mockResolvedValue(category);
    jest.spyOn(itemsRepository, 'findByCategoryId').mockResolvedValue([]);
    const items: Item[] = await sut.execute(category.id);
    expect(items.length).toBe(0);
  });
  it('should throw an error when category does not exist', async () => {
    jest.spyOn(categoriesRepository, 'findById').mockResolvedValue(null);
    await expect(sut.execute(randomUUID())).rejects.toThrow(
      new Error('Category does not exist'),
    );
  });
});
