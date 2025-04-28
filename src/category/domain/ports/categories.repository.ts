import { Category } from 'src/category/domain/category.entity';

export abstract class CategoriesRepository {
  abstract findByName(name: string): Promise<Category | null>;
  abstract save(category: Category): Promise<void>;
}
