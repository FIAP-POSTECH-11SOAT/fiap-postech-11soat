import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../ports/categories.repository';

type DeleteCategoryUseCaseInput = {
  id: string;
};

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async execute({ id }: DeleteCategoryUseCaseInput): Promise<void> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) throw new Error('Category not found');

    category.softDelete();

    await this.categoriesRepository.delete(category);
  }
}
