import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../ports/categories.repository';
import { Category } from '../category.entity';

@Injectable()
export class GetCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.findAll();

    return categories;
  }
}
