import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../ports/items.repository';
import { Item } from '../../item.entity';
import { GetItemsPort } from '../../ports/get-items.port';

@Injectable()
export class GetItemsUseCase implements GetItemsPort {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute(): Promise<Item[]> {
    return await this.itemsRepository.findAll();
  }
}
