import { Module } from '@nestjs/common';

import { CreatePaymentUseCase } from './domain/use-cases/create-payment/create-payment.service';
import { GetPaymentByOrderIdUseCase } from './domain/use-cases/get-payment-by-order-id/get-payment-by-order-id.service';
import { PaymentWebhookUseCase } from './domain/use-cases/payment-webhook/payment-webhook.service';
import { MercadoPagoService } from 'src/infra/gateways/payments/mercado-pago.service';
import { OrderModule } from 'src/order/order.module';
import { PaymentsRepository } from './domain/ports/payments.repository';
import { PrismaPaymentsRepository } from './persistence/prisma/prisma-payments.repository';
import { SearchPaymentsUseCase } from './domain/use-cases/search-payments/search-payments.service';
import { UpdatePaymentUseCase } from './domain/use-cases/update-payment/update-payment.service';
import { UpdatePaymentPort } from './domain/ports/update-payment.port';
import { GetPaymentByOrderIdController } from './http-server/get-payment-by-order-id/get-payment-by-order-id.controller';
import { UpdatePaymentController } from './http-server/update-payment/update-payment.controller';
import { GetPaymentByOrderIdPort } from './domain/ports/get-payment-by-order-id.port';
import { CreatePaymentController } from './http-server/create-payment/create-payment.controller';
import { CreatePaymentPort } from './domain/ports/create-payment.port';
import { SearchPaymentsController } from './http-server/search-payments/search-payments.controller';
import { SearchPaymentsPort } from './domain/ports/search-payments.port';
import { PaymentWebhookController } from './http-server/payment-webhook/payment-webhook.controller';
import { PaymentWebhookPort } from './domain/ports/payment-webhook.port';
import { PaymentGatewayPort } from './domain/ports/payment-gateway.port';

@Module({
  imports: [OrderModule],
  controllers: [
    CreatePaymentController,
    SearchPaymentsController,
    UpdatePaymentController,
    GetPaymentByOrderIdController,
    PaymentWebhookController
  ],
  providers: [
    {
      provide: CreatePaymentPort,
      useClass: CreatePaymentUseCase,
    },
    {
      provide: UpdatePaymentPort,
      useClass: UpdatePaymentUseCase,
    },
    {
      provide: GetPaymentByOrderIdPort,
      useClass: GetPaymentByOrderIdUseCase,
    },
    {
      provide: SearchPaymentsPort,
      useClass: SearchPaymentsUseCase,
    },
    {
      provide: PaymentWebhookPort,
      useClass: PaymentWebhookUseCase,
    },
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
    {
      provide: PaymentGatewayPort,
      useClass: MercadoPagoService,
    }
  ],
  exports: [PaymentsRepository]
})
export class PaymentsModule { }
