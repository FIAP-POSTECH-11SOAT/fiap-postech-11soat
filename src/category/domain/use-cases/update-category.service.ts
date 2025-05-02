import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../ports/categories.repository';

type UpdateCategoryUseCaseInput = {
  id: string;
  name: string;
};

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async execute({ id, name }: UpdateCategoryUseCaseInput): Promise<void> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) throw new Error('Category not found');

    category.name = name;

    await this.categoriesRepository.update(category);
  }
}
