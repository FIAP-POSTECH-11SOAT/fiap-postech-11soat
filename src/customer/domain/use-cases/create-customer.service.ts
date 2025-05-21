import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../ports/customers.repository';
import { Customer, CreateCustomerProps } from '../customer.entity';
import { CreateCustomerPort } from '../ports/create-customer.port'


@Injectable()
export class CreateCustomerUseCase implements CreateCustomerPort {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(customerProps: CreateCustomerProps): Promise<void> {
    const hasCustomer = await this.customersRepository.existsByDocumentOrEmail(customerProps.document, customerProps.email);

    if (hasCustomer) throw new Error(`Client with document ${customerProps.document} or email ${customerProps.email} already exists`);

    const category = Customer.create(customerProps);
    await this.customersRepository.save(category);
  }
}
