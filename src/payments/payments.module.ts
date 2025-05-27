import { Module } from '@nestjs/common';
import { CreatePaymentUseCase } from './domain/use-cases/create-payment/create-payment.service';
import { UpdatePaymentUseCase } from './domain/use-cases/update-payment/update-payment.service';
import { GetPaymentByOrderIdUseCase } from './domain/use-cases/get-payment-by-order-id/get-payment-by-order-id.service';
import { SearchPaymentsUseCase } from './domain/use-cases/search-payments/search-payments.service';
import { HandlePaymentWebhookUseCase } from './domain/use-cases/handle-payment-webhook/handle-payment-webhook.service';

import { PaymentsRepository } from './domain/ports/payments.repository';
import { PrismaPaymentsRepository } from './persistence/prisma/prisma-payments.repository';

import { PaymentsController } from './http-server/payments.controller';
import { PrismaModule } from 'src/infra/database/prisma/prisma.module';
import { MercadoPagoService } from 'src/infra/mercadopago/mercado-pago.service';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [PrismaModule, OrderModule],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    GetPaymentByOrderIdUseCase,
    SearchPaymentsUseCase,
    HandlePaymentWebhookUseCase,
    MercadoPagoService,
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
  ],
})
export class PaymentsModule {}
