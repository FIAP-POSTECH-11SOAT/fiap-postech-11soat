import { InMemoryCategoriesRepository } from 'src/category/persistence/database/in-memory/in-memory-categories.repository';
import { CreateCategoryUseCase } from './create-category.service';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: CreateCategoryUseCase;

describe('Crate Category Use Case', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to create a category', async () => {
    await sut.execute({ name: 'Category 1' });

    expect(inMemoryCategoriesRepository.categories).toHaveLength(1);
    expect(inMemoryCategoriesRepository.categories[0].name).toEqual(
      'Category 1',
    );
  });

  it('should not be able to create a category with the same name', async () => {
    await sut.execute({ name: 'Category 1' });

    expect(() => sut.execute({ name: 'Category 1' })).rejects.toThrow(
      new Error('Category already exists'),
    );
  });
});
