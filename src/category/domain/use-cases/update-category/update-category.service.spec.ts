import { InMemoryCategoriesRepository } from 'src/category/persistence/database/in-memory/in-memory-categories.repository';
import { UpdateCategoryUseCase } from './update-category.service';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { makeCategory } from 'test/factories/make-category';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: UpdateCategoryUseCase;

describe('Update Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new UpdateCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to update the name of a category', async () => {
    const newCategory = makeCategory({ name: 'Category 1' }, new UniqueEntityID('category-1'));
    await inMemoryCategoriesRepository.save(newCategory);

    await sut.execute({ id: 'category-1', name: 'Category X' });

    expect(inMemoryCategoriesRepository.categories[0].name).toBe('Category X');
  });

  it('should not be able to update non-existent category', async () => {
    expect(() => sut.execute({ id: 'category-1', name: 'Category X' })).rejects.toThrow(
      new Error('Category not found'),
    );
  });

  it('should not be able to update a category that was soft-deleted', async () => {
    const newCategory = makeCategory({ name: 'Category 1', deletedAt: new Date() }, new UniqueEntityID('category-1'));
    await inMemoryCategoriesRepository.save(newCategory);

    expect(() => sut.execute({ id: 'category-1', name: 'Category X' })).rejects.toThrow(
      new Error('Cannot update a deleted category'),
    );
  });

  it('should not be able to update if new name is already used by another category', async () => {
    const newCategory1 = makeCategory({ name: 'Category 1' }, new UniqueEntityID('category-1'));
    await inMemoryCategoriesRepository.save(newCategory1);
    const newCategory2 = makeCategory({ name: 'Category 2' }, new UniqueEntityID('category-2'));
    await inMemoryCategoriesRepository.save(newCategory2);

    expect(() => sut.execute({ id: 'category-2', name: 'Category 1' })).rejects.toThrow(
      new Error('Category already exists'),
    );
  });
});
