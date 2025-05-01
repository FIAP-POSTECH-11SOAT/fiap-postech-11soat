import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Category, CategoryProps } from 'src/category/domain/category.entity';
import { PrismaCategoryMapper } from 'src/category/persistence/database/prisma/mappers/prisma-category-mapper';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      name: faker.commerce.productMaterial(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );

  return category;
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data);

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    });

    return category;
  }
}
