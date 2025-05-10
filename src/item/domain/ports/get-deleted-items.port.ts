import { Item } from '../item.entity';

export abstract class GetDeletedItemsPort {
  abstract execute(): Promise<Item[]>;
}
