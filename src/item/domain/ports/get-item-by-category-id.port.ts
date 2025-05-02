import { Item } from '../item.entity';

export abstract class GetItemByCategoryIdPort {
  abstract execute(categoryId: string): Promise<Item[]>;
}
