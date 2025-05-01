import { Injectable } from '@nestjs/common';
import { CreateItemProps, Item } from '../../item.entity';
import { CreateItemPort } from '../../ports/create-item.port';
import { ItemsRepository } from '../../ports/items.repository';
import { CategoriesRepository } from '../../../../category/domain/ports/categories.repository';

@Injectable()
export class CreateItemUseCase implements CreateItemPort {
  constructor(
    private itemsRepository: ItemsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}
  async execute(createItem: CreateItemProps): Promise<Item> {
    //validate name
    const hasItem = await this.itemsRepository.findByName(createItem.name);
    if (hasItem) throw new Error('Item with this name already exists');

    //validate category
    const category = await this.categoriesRepository.findById(
      createItem.categoryId,
    );
    if (!category || category.deletedAt) throw new Error('Invalid category');

    //create item
    const newItem = Item.create(createItem);
    await this.itemsRepository.save(newItem);
    return newItem;
  }
}
