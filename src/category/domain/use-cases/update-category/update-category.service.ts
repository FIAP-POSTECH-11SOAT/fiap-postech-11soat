import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../ports/categories.repository';
import { UpdateCategoryInput, UpdateCategoryPort } from '../../ports/update-category.port';

@Injectable()
export class UpdateCategoryUseCase implements UpdateCategoryPort {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async execute({ id, name }: UpdateCategoryInput): Promise<void> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) throw new Error('Category not found');

    category.name = name;

    await this.categoriesRepository.update(category);
  }
}
