import { Category } from 'src/category/domain/category.entity';
import { CategoriesRepository } from 'src/category/domain/ports/categories.repository';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  categories: Category[] = [];

  async findAll(): Promise<Category[]> {
    return this.categories.filter((category) => !category.deletedAt);
  }

  async findById(id: string): Promise<Category | null> {
    const category = this.categories.find((category) => category.id === id);
    if (!category) return null;
    return category;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = this.categories.find((category) => category.name === name);
    if (!category) return null;
    return category;
  }

  async save(category: Category): Promise<void> {
    this.categories.push(category);
  }

  async delete(category: Category): Promise<void> {
    const index = this.categories.findIndex((c) => c.id === category.id);
    if (index >= 0) this.categories[index] = category;
  }
}
