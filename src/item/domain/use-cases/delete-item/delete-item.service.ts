import { Injectable } from '@nestjs/common';
import { Item } from '../../item.entity';
import { ItemsRepository } from '../../ports/items.repository';
import { DeleteItemPort } from '../../ports/delete-item.port';

@Injectable()
export class DeleteItemUseCase implements DeleteItemPort {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute(id: string): Promise<Item> {
    const item: Item | null = await this.itemsRepository.findById(id);
    if (!item) throw new Error('Item not found');
    item.softDelete();
    await this.itemsRepository.delete(item);
    return item;
  }
}
