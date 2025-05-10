import { Module } from '@nestjs/common';
import { CreateCategoryController } from './http-server/create-category.controller';
import { CreateCategoryUseCase } from './domain/use-cases/create-category.service';
import { CategoriesRepository } from './domain/ports/categories.repository';
import { PrismaCategoriesRepository } from './persistence/database/prisma/prisma-categories.repository';
import { DeleteCategoryController } from './http-server/delete-category/delete-category.controller';
import { DeleteCategoryUseCase } from './domain/use-cases/delete-category/delete-category.service';
import { GetCategoriesController } from './http-server/get-categories/get-categories.controller';
import { GetCategoriesUseCase } from './domain/use-cases/get-categories/get-categories.service';
import { UpdateCategoryUseCase } from './domain/use-cases/update-category.service';
import { UpdateCategoryController } from './http-server/update-category.controller';
import { ItemsRepository } from 'src/item/domain/ports/items.repository';
import { PrismaItemsRepository } from 'src/item/persistence/prisma/prisma-items.repository';
import { DeleteCategoryPort } from './domain/ports/delete-category.port';
import { GetCategoriesPort } from './domain/ports/get-categories.port';

@Module({
  controllers: [CreateCategoryController, DeleteCategoryController, GetCategoriesController, UpdateCategoryController],
  providers: [
    CreateCategoryUseCase,
    {
      provide: DeleteCategoryPort,
      useClass: DeleteCategoryUseCase,
    },
    {
      provide: GetCategoriesPort,
      useClass: GetCategoriesUseCase,
    },
    UpdateCategoryUseCase,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: ItemsRepository,
      useClass: PrismaItemsRepository,
    },
  ],
  exports: [CategoriesRepository],
})
export class CategoryModule { }
