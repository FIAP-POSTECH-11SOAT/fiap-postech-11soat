import { Module } from '@nestjs/common';
import { CreateItemController } from './http-server/create-item/create-item.controller';
import { CreateItemUseCase } from './domain/use-cases/create-item/create-item.service';
import { PrismaItemsRepository } from './persistence/prisma/prisma-items.repository';
import { ItemsRepository } from './domain/ports/items.repository';
import { CreateItemPort } from './domain/ports/create-item.port';
import { CategoryModule } from '../category/category.module';
import { GetItemsPort } from './domain/ports/get-items.port';
import { GetItemsUseCase } from './domain/use-cases/get-items/get-items.service';
import { GetItemsController } from './http-server/get-items/get-items.controller';

@Module({
  imports: [CategoryModule],
  controllers: [CreateItemController, GetItemsController],
  providers: [
    {
      provide: ItemsRepository,
      useClass: PrismaItemsRepository,
    },
    {
      provide: CreateItemPort,
      useClass: CreateItemUseCase,
    },
    {
      provide: GetItemsPort,
      useClass: GetItemsUseCase,
    },
  ],
})
export class ItemModule {}
