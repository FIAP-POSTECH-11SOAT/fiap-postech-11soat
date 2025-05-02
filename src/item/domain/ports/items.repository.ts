import { Item } from '../item.entity';

export abstract class ItemsRepository {
  abstract findByName(name: string): Promise<Item | null>;
  abstract save(item: Item): Promise<void>;
  abstract findAll(): Promise<Item[]>;
  abstract findById(id: string): Promise<Item | null>;
  abstract findByCategoryId(categoryId: string): Promise<Item[]>;
}
