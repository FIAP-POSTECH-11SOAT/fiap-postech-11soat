import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { ItemsRepository } from '../../domain/ports/items.repository';
import { Item } from '../../domain/item.entity';
import PrismaItemsMapper from './mappers/prisma-items.mapper';

@Injectable()
export class PrismaItemsRepository implements ItemsRepository {
  constructor(private prismaService: PrismaService) {}
  async findByName(name: string): Promise<Item | null> {
    console.log(name);
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
