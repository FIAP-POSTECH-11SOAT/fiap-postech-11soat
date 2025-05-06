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
import { GetItemByIdController } from './http-server/get-item-by-id/get-item-by-id.controller';
import { GetItemByIdPort } from './domain/ports/get-item-by-id.port';
import { GetItemByIdUseCase } from './domain/use-cases/get-item-by-id/get-item-by-id.service';

@Module({
  imports: [CategoryModule],
  controllers: [
    CreateItemController,
    GetItemsController,
    GetItemByIdController,
  ],
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
    {
      provide: GetItemByIdPort,
      useClass: GetItemByIdUseCase,
    },
  ],
  exports: [ItemsRepository], // Exporta o ItemsRepository, se necessário
})
export class ItemModule {}
