import { Category } from 'src/category/domain/category.entity';
import { CategoriesRepository } from 'src/category/domain/ports/categories.repository';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  categories: Category[] = [];

  async findByName(name: string): Promise<Category | null> {
    const category = this.categories.find((category) => category.name === name);
    if (!category) return null;
    return category;
  }

  async save(category: Category): Promise<void> {
    this.categories.push(category);
  }
}
