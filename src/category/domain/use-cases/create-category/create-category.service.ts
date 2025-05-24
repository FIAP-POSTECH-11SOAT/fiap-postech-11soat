import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../ports/categories.repository';
import { Category } from '../../category.entity';
import { CreateCategoryPort } from '../../ports/create-category.port';

@Injectable()
export class CreateCategoryUseCase implements CreateCategoryPort {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async execute({ name }: { name: string }): Promise<void> {
    const existingCategory = await this.categoriesRepository.findByName(name);

    if (existingCategory) {
      if (existingCategory.deletedAt) {
        existingCategory.reactivate();
        await this.categoriesRepository.update(existingCategory);
        return;
      }
      throw new Error('Category already exists');
    }

    const category = Category.create({ name });
    await this.categoriesRepository.save(category);
  }
}
