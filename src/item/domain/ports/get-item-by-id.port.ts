import { Item } from '../item.entity';

export abstract class GetItemByIdPort {
  abstract execute(id: string): Promise<Item>;
}
