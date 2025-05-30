import { Module, forwardRef } from '@nestjs/common';

import { CreatePaymentUseCase } from './domain/use-cases/create-payment/create-payment.service';
import { GetPaymentByOrderIdUseCase } from './domain/use-cases/get-payment-by-order-id/get-payment-by-order-id.service';
import { HandlePaymentWebhookUseCase } from './domain/use-cases/handle-payment-webhook/handle-payment-webhook.service';
import { HttpModule } from '@nestjs/axios';
import { MercadoPagoService } from 'src/infra/mercadopago/mercado-pago.service';
import { OrderModule } from 'src/order/order.module';
import { OrderStatusClient } from 'src/infra/http-server/order-status.client';
import { PaymentsController } from './http-server/payments.controller';
import { PaymentsRepository } from './domain/ports/payments.repository';
import { PrismaModule } from 'src/infra/database/prisma/prisma.module';
import { PrismaPaymentsRepository } from './persistence/prisma/prisma-payments.repository';
import { SearchPaymentsUseCase } from './domain/use-cases/search-payments/search-payments.service';
import { UpdatePaymentUseCase } from './domain/use-cases/update-payment/update-payment.service';

@Module({
  imports: [PrismaModule, forwardRef(() => OrderModule), HttpModule],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    GetPaymentByOrderIdUseCase,
    SearchPaymentsUseCase,
    HandlePaymentWebhookUseCase,
    MercadoPagoService,
    OrderStatusClient,
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
  ],
  exports: [PaymentsRepository]
})
export class PaymentsModule { }
