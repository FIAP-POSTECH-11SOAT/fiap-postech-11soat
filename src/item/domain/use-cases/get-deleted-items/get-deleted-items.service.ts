import { Injectable } from '@nestjs/common';
import { ItemsRepository } from '../../ports/items.repository';

@Injectable()
export class GetDeletedItemsUseCase {
  constructor(private itemsRepository: ItemsRepository) {}

  async execute() {
    return await this.itemsRepository.findDeleted();
  }
}
