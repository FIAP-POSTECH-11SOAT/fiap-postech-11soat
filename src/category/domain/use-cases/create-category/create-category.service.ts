import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../ports/categories.repository';
import { Category } from '../../category.entity';
import { CreateCategoryPort } from '../../ports/create-category.port';

@Injectable()
export class CreateCategoryUseCase implements CreateCategoryPort {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async execute({ name }: { name: string }): Promise<void> {
    const hasCategory = await this.categoriesRepository.findByName(name);

    if (hasCategory) throw new Error('Category already exists');

    const category = Category.create({ name });
    await this.categoriesRepository.save(category);
  }
}
