import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../ports/categories.repository';
import { Category } from '../../category.entity';
import { GetCategoriesPort } from '../../ports/get-categories.port';

@Injectable()
export class GetCategoriesUseCase implements GetCategoriesPort {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.findAll();
    return categories;
  }
}
