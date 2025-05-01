import { randomUUID } from 'node:crypto';
import { Category } from '../../../../category/domain/category.entity';
import { InMemoryCategoriesRepository } from '../../../../category/persistence/database/in-memory/in-memory-categories.repository';
import { InMemoryItemsRepository } from '../../../persistence/in-memory/in-memory-items.repository';
import { CreateItemProps } from '../../item.entity';
import { CreateItemUseCase } from './create-item.service';
import { UniqueEntityID } from '../../../../shared/entities/unique-entity-id';

describe('Create Item Use Case', () => {
  let inMemoryItemsRepository: InMemoryItemsRepository;
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
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

  beforeEach(() => {
    inMemoryItemsRepository = new InMemoryItemsRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new CreateItemUseCase(
      inMemoryItemsRepository,
      inMemoryCategoriesRepository,
    );
    jest
      .spyOn(inMemoryCategoriesRepository, 'findById')
      .mockResolvedValue(
        Category.create(
          { name: 'Test Category' },
          new UniqueEntityID(createItemProps.categoryId),
        ),
      );
  });
  it('should create an item', async () => {
    const item = await sut.execute(createItemProps);
    expect(item).toBeDefined();
    expect(inMemoryItemsRepository.items).toHaveLength(1);
    expect(inMemoryItemsRepository.items[0].name).toBe('Test Name');
    expect(item.categoryId).toBe(createItemProps.categoryId);
  });
  it('should create an item without image', async () => {
    delete createItemProps.image;
    const item = await sut.execute(createItemProps);
    expect(item.image).toBe(null);
  });
  it('should throw an error if item with this name already exists', async () => {
    await sut.execute(createItemProps);
    await expect(() => sut.execute(createItemProps)).rejects.toThrow(
      new Error('Item with this name already exists'),
    );
  });
  it('should throw an error if category does not exist', async () => {
    //mock category repository to return null
    jest
      .spyOn(inMemoryCategoriesRepository, 'findById')
      .mockResolvedValue(null);

    await expect(() => sut.execute(createItemProps)).rejects.toThrow(
      new Error('Invalid category'),
    );
  });
  it('should throw an error if category is deleted', async () => {
    //mock category repository to return deleted
    jest
      .spyOn(inMemoryCategoriesRepository, 'findById')
      .mockResolvedValue(
        Category.create(
          { name: 'Test Category', deletedAt: new Date() },
          new UniqueEntityID(createItemProps.categoryId),
        ),
      );

    await expect(() => sut.execute(createItemProps)).rejects.toThrow(
      new Error('Invalid category'),
    );
  });
});
