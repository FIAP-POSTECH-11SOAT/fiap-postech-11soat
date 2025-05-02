import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../ports/items.repository';
import { Item } from '../../item.entity';
import { CategoriesRepository } from '../../../../category/domain/ports/categories.repository';
import { GetItemByCategoryIdPort } from '../../ports/get-item-by-category-id.port';

@Injectable()
export class GetItemByCategoryIdUseCase implements GetItemByCategoryIdPort {
  constructor(
    private itemsRepository: ItemsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(categoryId: string): Promise<Item[]> {
    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) throw new Error('Category does not exist');
    return await this.itemsRepository.findByCategoryId(categoryId);
  }
}
