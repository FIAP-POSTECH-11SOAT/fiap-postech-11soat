import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../ports/items.repository';
import { Item } from '../../item.entity';

@Injectable()
export class ActivateItemUseCase {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute(id: string): Promise<Item> {
    const item: Item | null = await this.itemsRepository.findById(id);
    if (!item) throw new Error('Item not found');
    if (!item.deletedAt) throw new Error('Item not deleted');
    item.activate();
    await this.itemsRepository.update(item);
    return item;
  }
}
