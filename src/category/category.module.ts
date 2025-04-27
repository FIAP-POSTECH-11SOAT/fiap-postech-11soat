import { Module } from '@nestjs/common';
import { Category } from './domain/category.entity';

@Module({
  providers: [Category],
})
export class CategoryModule {}
