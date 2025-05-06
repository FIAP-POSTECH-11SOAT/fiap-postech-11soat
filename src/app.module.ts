import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { ItemModule } from './item/item.module';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [PrismaModule, CustomerModule, CategoryModule, ItemModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
