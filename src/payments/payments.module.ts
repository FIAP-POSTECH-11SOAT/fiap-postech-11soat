import { Module } from '@nestjs/common';

import { CreatePaymentUseCase } from './domain/use-cases/create-payment/create-payment.service';
import { GetPaymentByOrderIdUseCase } from './domain/use-cases/get-payment-by-order-id/get-payment-by-order-id.service';
import { HandlePaymentWebhookUseCase } from './domain/use-cases/handle-payment-webhook/handle-payment-webhook.service';
import { MercadoPagoService } from 'src/infra/mercadopago/mercado-pago.service';
import { OrderModule } from 'src/order/order.module';
import { PaymentsController } from './http-server/payments.controller';
import { PaymentsRepository } from './domain/ports/payments.repository';
import { PrismaPaymentsRepository } from './persistence/prisma/prisma-payments.repository';
import { SearchPaymentsUseCase } from './domain/use-cases/search-payments/search-payments.service';
import { UpdatePaymentUseCase } from './domain/use-cases/update-payment/update-payment.service';
import { UpdatePaymentPort } from './domain/ports/update-payment.port';

@Module({
  imports: [OrderModule],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    {
      provide: UpdatePaymentPort,
      useClass: UpdatePaymentUseCase,
    },
    GetPaymentByOrderIdUseCase,
    SearchPaymentsUseCase,
    HandlePaymentWebhookUseCase,
    MercadoPagoService,
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
  ],
  exports: [PaymentsRepository]
})
export class PaymentsModule { }
