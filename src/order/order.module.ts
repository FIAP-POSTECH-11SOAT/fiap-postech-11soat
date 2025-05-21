import { CreateOrderController } from './http-server/create-order.controller';
import { CreateOrderItemController } from './http-server/create-order-item.controller';
import { CreateOrderItemPort } from './domain/ports/create-order-item.port';
import { CreateOrderItemUseCase } from './domain/use-cases/create-order-item/create-order-item.service';
import { CreateOrderPort } from './domain/ports/create-order.port';
import { CreateOrderUseCase } from './domain/use-cases/create-order/create-order.service';
import { DeleteOrderItemController } from './http-server/delete-order-item.controller';
import { DeleteOrderItemPort } from './domain/ports/delete-order-item.port';
import { DeleteOrderItemUseCase } from './domain/use-cases/delete-order-item/delete-order-item.service';
import { GetFullOrderByIdController } from './http-server/get-full-order-by-id.controller';
import { GetFullOrderByIdPort } from './domain/ports/get-full-order-by-id.port';
import { GetFullOrderByIdUseCase } from './domain/use-cases/get-full-order-by-id/get-full-order-by-id.service';
import { ItemModule } from '../item/item.module';
import { Module } from '@nestjs/common';
import { OrdersRepository } from './domain/ports/orders.repository';
import { PrismaOrdersRepository } from './persistence/database/prisma/prisma-orders.repository';
import { UpdateStatusController } from './http-server/update-status.controller';
import { UpdateStatusPort } from './domain/ports/update-status.port';
import { UpdateStatusUseCase } from './domain/use-cases/update-status/update-status.service';

@Module({
  imports: [ItemModule],
  controllers: [
    GetFullOrderByIdController,
    UpdateStatusController,
    CreateOrderController,
    CreateOrderItemController,
    DeleteOrderItemController
  ],
  providers: [
    {
      provide: GetFullOrderByIdPort,
      useClass: GetFullOrderByIdUseCase,
    },
    {
      provide: UpdateStatusPort,
      useClass: UpdateStatusUseCase,
    },
    {
      provide: CreateOrderPort,
      useClass: CreateOrderUseCase,
    },
    {
      provide: CreateOrderItemPort,
      useClass: CreateOrderItemUseCase,
    },
    {
      provide: DeleteOrderItemPort,
      useClass: DeleteOrderItemUseCase,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    }
  ],
  exports: [OrdersRepository]
})
export class OrderModule { }
