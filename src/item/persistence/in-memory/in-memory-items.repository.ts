import { Item } from '../../domain/item.entity';
import { ItemsRepository } from '../../domain/ports/items.repository';

export class InMemoryItemsRepository implements ItemsRepository {
  items: Item[] = [];
  async findByName(name: string): Promise<Item | null> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    const item = this.items.find((item) => item.name === name);
    if (!item) return null;
    return item;
  }
  async save(item: Item): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    this.items.push(item);
  }

  async findAll(): Promise<Item[]> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return this.items;
  }
}
