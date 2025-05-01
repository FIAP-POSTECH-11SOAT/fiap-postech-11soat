import { InMemoryCategoriesRepository } from 'src/category/persistence/database/in-memory/in-memory-categories.repository';
import { DeleteCategoryUseCase } from './delete-category.service';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { makeCategory } from 'test/factories/make-category';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: DeleteCategoryUseCase;

describe('Soft Delete Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new DeleteCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to delete an category', async () => {
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
});
