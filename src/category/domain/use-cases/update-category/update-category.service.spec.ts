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

  it('should be able to edit the name of a category', async () => {
    const newCategory = makeCategory({ name: 'Category 1' }, new UniqueEntityID('category-1'));
    await inMemoryCategoriesRepository.save(newCategory);

    await sut.execute({ id: 'category-1', name: 'Category X' });

    expect(inMemoryCategoriesRepository.categories[0].name).toBe('Category X');
  });

  it('should not be able to edit non-existent category', async () => {
    expect(() => sut.execute({ id: 'category-1', name: 'Category X' })).rejects.toThrow(
      new Error('Category not found'),
    );
  });
});
