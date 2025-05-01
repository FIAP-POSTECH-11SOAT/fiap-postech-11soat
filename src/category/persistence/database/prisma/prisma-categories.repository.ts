import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CategoriesRepository } from 'src/category/domain/ports/categories.repository';
import { PrismaCategoryMapper } from './mappers/prisma-category-mapper';
import { Category } from 'src/category/domain/category.entity';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) return null;

    return PrismaCategoryMapper.toDomain(category);
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (!category) return null;

    return PrismaCategoryMapper.toDomain(category);
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await this.prisma.category.create({ data });
  }

  async delete(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await this.prisma.category.update({
      where: { id: category.id },
      data,
    });
  }
}
