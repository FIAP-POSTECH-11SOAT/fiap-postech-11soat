import { Item } from '../item.entity';

export abstract class DeleteItemPort {
  abstract execute(id: string): Promise<Item>;
}
