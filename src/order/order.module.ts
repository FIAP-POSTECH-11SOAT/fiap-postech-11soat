import { CreateOrderController } from './http-server/create-order.controller';
import { CreateOrderItemController } from './http-server/create-order-item.controller';
import { CreateOrderItemUseCase } from './domain/use-cases/create-order-item.service';
import { CreateOrderUseCase } from './domain/use-cases/create-order.service';
import { DeleteOrderItemController } from './http-server/delete-order-item.controller';
import { DeleteOrderItemUseCase } from './domain/use-cases/delete-order-item.service';
import { ItemModule } from '../item/item.module';
import { Module } from '@nestjs/common';
import { OrdersRepository } from './domain/ports/orders.repository';
import { PrismaOrdersRepository } from './persistence/database/prisma/prisma-orders.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Module({
  imports: [
    ItemModule
  ],
  controllers: [
    CreateOrderController,
    CreateOrderItemController,
    DeleteOrderItemController
  ],
  providers: [
    CreateOrderUseCase,
    CreateOrderItemUseCase,
    DeleteOrderItemUseCase,
    PrismaService,
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
  ],
})
export class OrderModule { }
