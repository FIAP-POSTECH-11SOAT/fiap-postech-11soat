import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../ports/items.repository';
import { Item } from '../../item.entity';
import { GetItemByIdPort } from '../../ports/get-item-by-id.port';

@Injectable()
export class GetItemByIdUseCase implements GetItemByIdPort {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute(id: string): Promise<Item> {
    const item = await this.itemsRepository.findById(id);
    if (!item) throw new Error('Item not found');
    return item;
  }
}
