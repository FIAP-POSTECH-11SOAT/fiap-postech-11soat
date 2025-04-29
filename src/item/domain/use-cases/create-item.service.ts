import { CreateItemProps, Item } from '../item.entity';
import { ItemsRepository } from '../ports/items.repository';

export class CreateItemUseCase {
  constructor(private itemsRepository: ItemsRepository) {}
  async execute(createItem: CreateItemProps): Promise<Item> {
    const hasItem = await this.itemsRepository.findByName(createItem.name);
    if (hasItem) throw new Error('Item already exists');
    const newItem = Item.create(createItem);
    await this.itemsRepository.save(newItem);
    return newItem;
  }
}
