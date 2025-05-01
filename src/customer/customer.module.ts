import { Module } from '@nestjs/common';
import { CreateCustomerController } from './http-server/create-customer.controller';
import { CreateCustomerUseCase } from './domain/use-cases/create-customer.service';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CustomersRepository } from './domain/ports/customers.repository';
import { PrismaCustomersRepository } from './persistence/database/prisma/prisma-customers.repository';

@Module({
  controllers: [CreateCustomerController],
  providers: [
    CreateCustomerUseCase,
    PrismaService,
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
  ],
})
export class CustomerModule {}
