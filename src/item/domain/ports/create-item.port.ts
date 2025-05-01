import { CreateItemProps, Item } from '../item.entity';

export abstract class CreateItemPort {
  abstract execute(createItem: CreateItemProps): Promise<Item>;
}
