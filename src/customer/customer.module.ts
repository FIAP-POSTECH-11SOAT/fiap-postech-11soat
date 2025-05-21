import { Module } from '@nestjs/common';
import { CreateCustomerController } from './http-server/create-customer.controller';
import { CreateCustomerUseCase } from './domain/use-cases/create-customer.service';
import { UpdateCustomerController } from './http-server/update-customer.controller';
import { CustomersRepository } from './domain/ports/customers.repository';
import { PrismaCustomersRepository } from './persistence/database/prisma/prisma-customers.repository';
import { GetCustomerByDocumentController } from './http-server/get-customer-by-document.controller';
import { GetCustomerUseCase } from './domain/use-cases/get-customer.service';
import { GetCustomerByDocumentPort } from './domain/ports/get-customer-by-document.port'
import { UpdateCustomerUseCase } from './domain/use-cases/update-customer.service';
import { UpdateCustomerPort } from './domain/ports/update-customer.port'

@Module({
  controllers: [
    UpdateCustomerController,
    CreateCustomerController,
    GetCustomerByDocumentController],
  providers: [
    CreateCustomerUseCase,
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository
    },
    {
      provide: GetCustomerByDocumentPort,
      useClass: GetCustomerUseCase
    },
    {
      provide: UpdateCustomerPort,
      useClass: UpdateCustomerUseCase
    },
    {
      provide: CreateCustomerUseCase,
      useClass: CreateCustomerUseCase
    }
  ],
  exports: [CustomersRepository]
})
export class CustomerModule {}
