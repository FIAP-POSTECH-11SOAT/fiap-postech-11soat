import { Item } from '../domain/item.entity';

export class ItemPresenter {
  static toHttp(item: Item) {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.categoryId,
      image: item.image,
    };
  }
}
