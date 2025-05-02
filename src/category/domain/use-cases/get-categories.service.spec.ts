import { InMemoryCategoriesRepository } from 'src/category/persistence/database/in-memory/in-memory-categories.repository';
import { GetCategoriesUseCase } from './get-categories.service';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { makeCategory } from 'test/factories/make-category';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: GetCategoriesUseCase;

describe('Soft Delete Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new GetCategoriesUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to list categories', async () => {
    const newCategory = makeCategory({ name: 'Category 1' }, new UniqueEntityID('category-1'));
    const newCategory2 = makeCategory({ name: 'Category 2' }, new UniqueEntityID('category-2'));
    await inMemoryCategoriesRepository.save(newCategory);
    await inMemoryCategoriesRepository.save(newCategory2);

    const categories = await sut.execute();

    expect(categories).toHaveLength(2);
    expect(categories[0].id).toBe('category-1');
    expect(categories[0].name).toBe('Category 1');
  });
});
