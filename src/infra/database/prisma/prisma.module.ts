import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaOrderQueryAdapter } from './prisma-order-query-adapter';
import { ORDER_QUERY_PORT } from 'src/payments/domain/ports/order-query.port';

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaOrderQueryAdapter,
    {
      provide: ORDER_QUERY_PORT,
      useClass: PrismaOrderQueryAdapter,
    },
  ],
  exports: [PrismaService, ORDER_QUERY_PORT],
})
export class PrismaModule {}
