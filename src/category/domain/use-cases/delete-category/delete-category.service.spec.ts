import { InMemoryCategoriesRepository } from 'src/category/persistence/database/in-memory/in-memory-categories.repository';
import { DeleteCategoryUseCase } from './delete-category.service';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { makeCategory } from 'test/factories/make-category';
import { InMemoryItemsRepository } from 'src/item/persistence/in-memory/in-memory-items.repository';
import { Item } from 'src/item/domain/item.entity';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let inMemoryItemsRepository: InMemoryItemsRepository;
let sut: DeleteCategoryUseCase;

describe('Soft Delete Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    inMemoryItemsRepository = new InMemoryItemsRepository();
    sut = new DeleteCategoryUseCase(inMemoryCategoriesRepository, inMemoryItemsRepository);
  });

  it('should be able to delete a category', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-1'));
    await inMemoryCategoriesRepository.save(newCategory);

    await sut.execute({ id: 'category-1' });

    expect(newCategory.deletedAt).toBeDefined();
    expect(inMemoryCategoriesRepository.categories).toHaveLength(1);
    expect(inMemoryCategoriesRepository.categories[0].deletedAt).toBeDefined();
  });

  it('should not be able to delete non-existent category', async () => {
    expect(() => sut.execute({ id: 'category-1' })).rejects.toThrow(
      new Error('Category not found'),
    );
  });

  it('should throw an error if category has already been deleted', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-1'));
    await inMemoryCategoriesRepository.save(newCategory);

    await sut.execute({ id: 'category-1' })

    expect(() => sut.execute({ id: 'category-1' })).rejects.toThrow(
      new Error('Category already deleted'),
    );
  });

  it('should throw an error if category has active items', async () => {
    const newCategory = makeCategory({}, new UniqueEntityID('category-1'));
    await inMemoryCategoriesRepository.save(newCategory);

    const newItem = Item.create({
      id: 'item-1',
      name: 'Test Name',
      description: 'Test Description',
      price: 10,
      categoryId: 'category-1',
      image: 'Test Image',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await inMemoryItemsRepository.save(newItem);

    expect(() => sut.execute({ id: 'category-1' })).rejects.toThrow(
      new Error('This category still has active items. Please deactivate or remove them before deleting the category'),
    );
  });
});
