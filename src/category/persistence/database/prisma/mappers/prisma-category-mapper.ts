import { Prisma, Category as PrismaCategory } from '@prisma/client';
import { Category } from 'src/category/domain/category.entity';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return new Category(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
    };
  }
}
