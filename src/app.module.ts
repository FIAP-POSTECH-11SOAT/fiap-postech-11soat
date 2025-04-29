import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [CustomerModule, CategoryModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
