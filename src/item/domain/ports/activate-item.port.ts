import { Item } from '../item.entity';

export abstract class ActivateItemPort {
  abstract execute(id: string): Promise<Item>;
}
