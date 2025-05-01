import { Item } from '../item.entity';

export abstract class GetItemsPort {
  abstract execute(): Promise<Item[]>;
}
