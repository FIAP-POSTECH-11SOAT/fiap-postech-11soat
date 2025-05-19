import { Module } from '@nestjs/common';
import { CreatePaymentUseCase } from './domain/use-cases/create-payment/create-payment.service';
import { UpdatePaymentUseCase } from './domain/use-cases/update-payment/update-payment.service';
import { PaymentsRepository } from './domain/ports/payments.repository';
import { PrismaPaymentsRepository } from './persistence/prisma/prisma-payments.repository';
import { PaymentsController } from './http-server/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    {
      provide: PaymentsRepository,
      useClass: PrismaPaymentsRepository,
    },
  ],
  exports: [CreatePaymentUseCase, UpdatePaymentUseCase],
})
export class PaymentsModule {}
