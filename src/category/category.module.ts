import { Module } from '@nestjs/common';
import { CreateCategoryController } from './http-server/create-category.controller';
import { CreateCategoryUseCase } from './domain/use-cases/create-category.service';
import { CategoriesRepository } from './domain/ports/categories.repository';
import { PrismaCategoriesRepository } from './persistence/database/prisma/prisma-categories.repository';
import { DeleteCategoryController } from './http-server/delete-category.controller';
import { DeleteCategoryUseCase } from './domain/use-cases/delete-category.service';
import { GetCategoriesController } from './http-server/get-categories.controller';
import { GetCategoriesUseCase } from './domain/use-cases/get-categories.service';

@Module({
  controllers: [CreateCategoryController, DeleteCategoryController, GetCategoriesController],
  providers: [
    CreateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoriesUseCase,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
  ],
  exports: [CategoriesRepository],
})
export class CategoryModule { }
