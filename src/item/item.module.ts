import { Module } from '@nestjs/common';
import { CreateItemController } from './http-server/create-item/create-item.controller';
import { CreateItemUseCase } from './domain/use-cases/create-item.service';
import { PrismaItemsRepository } from './persistence/prisma/prisma-items.repository';
import { ItemsRepository } from './domain/ports/items.repository';
import { CreateItemPort } from './domain/ports/create-item.port';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule],
  controllers: [CreateItemController],
  providers: [
    {
      provide: ItemsRepository,
      useClass: PrismaItemsRepository,
    },
    {
      provide: CreateItemPort,
      useClass: CreateItemUseCase,
    },
  ],
})
export class ItemModule {}
