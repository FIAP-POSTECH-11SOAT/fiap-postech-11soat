import { Module } from '@nestjs/common';
import { CreateCategoryController } from './http-server/create-category.controller';
import { CreateCategoryUseCase } from './domain/use-cases/create-category.service';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CategoriesRepository } from './domain/ports/categories.repository';
import { PrismaCategoriesRepository } from './persistence/database/prisma/prisma-categories.repository';

@Module({
  controllers: [CreateCategoryController],
  providers: [
    CreateCategoryUseCase,
    PrismaService,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
  ],
})
export class CategoryModule {}
