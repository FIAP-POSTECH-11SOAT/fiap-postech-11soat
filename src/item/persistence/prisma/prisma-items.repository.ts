import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ItemsRepository } from '../../domain/ports/items.repository';
import { Item } from '../../domain/item.entity';
import PrismaItemsMapper from './mappers/prisma-items.mapper';

@Injectable()
export class PrismaItemsRepository implements ItemsRepository {
  constructor(private prismaService: PrismaService) {}
  async update(item: Item): Promise<void> {
    const data = PrismaItemsMapper.toPrisma(item);
    await this.prismaService.item.update({
      where: {
        id: item.id,
      },
      data,
    });
  }
  async delete(item: Item): Promise<void> {
    await this.prismaService.item.update({
      where: {
        id: item.id,
      },
      data: {
        deletedAt: item.deletedAt,
      },
    });
  }

  async findDeleted(): Promise<Item[]> {
    const items = await this.prismaService.item.findMany({
      where: { deletedAt: { not: null } },
    });
    return items.map((item) => PrismaItemsMapper.toDomain(item));
  }

  async findByCategoryId(categoryId: string): Promise<Item[]> {
    const items = await this.prismaService.item.findMany({
      where: { AND: [{ deletedAt: null }, { categoryId }] },
    });
    return items.map((item) => PrismaItemsMapper.toDomain(item));
  }
  async findById(id: string): Promise<Item | null> {
    const item = await this.prismaService.item.findUnique({
      where: { id },
    });
    if (!item) return null;
    return PrismaItemsMapper.toDomain(item);
  }
  async findAll(): Promise<Item[]> {
    const items = await this.prismaService.item.findMany({
      where: { deletedAt: null },
    });
    return items.map((item) => PrismaItemsMapper.toDomain(item));
  }
  async findByName(name: string): Promise<Item | null> {
    const item = await this.prismaService.item.findFirst({
      where: { name },
    });
    if (!item) return null;
    return PrismaItemsMapper.toDomain(item);
  }
  async save(item: Item): Promise<void> {
    const data = PrismaItemsMapper.toPrisma(item);
    await this.prismaService.item.create({ data });
  }
}
