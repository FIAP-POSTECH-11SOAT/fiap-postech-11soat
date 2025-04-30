import { Item as PrismaItem, Prisma } from '@prisma/client';
import { Item } from '../../../domain/item.entity';

export default class PrismaItemsMapper {
  static toPrisma(item: Item): Prisma.ItemUncheckedCreateInput {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      image: item.image,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt,
    };
  }

  static toDomain(raw: PrismaItem): Item {
    return Item.create({ ...raw, price: Number(raw.price) });
  }
}
