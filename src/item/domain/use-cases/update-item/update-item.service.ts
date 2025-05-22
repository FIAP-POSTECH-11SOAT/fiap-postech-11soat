import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../ports/items.repository';
import { UpdateItemProps } from '../../ports/update-item.port';
import { Item } from '../../item.entity';
import { CategoriesRepository } from '../../../../category/domain/ports/categories.repository';

@Injectable()
export class UpdateItemUseCase {
  constructor(
    private itemsRepository: ItemsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(id: string, updateItemProps: UpdateItemProps): Promise<Item> {
    const item = await this.itemsRepository.findById(id);
    if (!item) throw new Error('Item not found');

    if (updateItemProps.categoryId) {
      const category = await this.categoriesRepository.findById(
        updateItemProps.categoryId,
      );
      if (!category) throw new Error('Category not found');
      if (category.deletedAt) throw new Error('Invalid category');
      item.categoryId = updateItemProps.categoryId;
    }

    if (updateItemProps.name) {
      const hasItemWithName = await this.itemsRepository.findByName(
        updateItemProps.name,
      );

      if (hasItemWithName && hasItemWithName.id !== id)
        throw new Error('Item with this name already exists');
      item.name = updateItemProps.name;
    }

    if (updateItemProps.description)
      item.description = updateItemProps.description;

    if (updateItemProps.price) item.price = updateItemProps.price;

    if (updateItemProps.image || updateItemProps.image === null)
      item.image = updateItemProps.image;

    await this.itemsRepository.update(item);

    return item;
  }
}
