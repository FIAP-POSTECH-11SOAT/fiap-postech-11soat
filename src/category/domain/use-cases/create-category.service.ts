import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../ports/categories.repository';
import { Category } from '../category.entity';

type CreateCategoryUseCaseInput = {
  name: string;
};

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({ name }: CreateCategoryUseCaseInput): Promise<void> {
    const hasCategory = await this.categoriesRepository.findByName(name);

    if (hasCategory) throw new Error('Category already exists');

    const category = Category.create({ name });
    await this.categoriesRepository.save(category);
  }
}
