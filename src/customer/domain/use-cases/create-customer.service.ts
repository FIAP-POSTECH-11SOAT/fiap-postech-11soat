import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../ports/customers.repository';
import { Customer } from '../customer.entity';

type CreateCustomerUseCaseInput = {
  name: string;
  document: string;
  email: string;  
};

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute({ name: name, document: document, email: email }: CreateCustomerUseCaseInput): Promise<void> {
    const hasCustomer = await this.customersRepository.existsByDocumentOrEmail(document, email);

    if (hasCustomer) throw new Error(`Client with document ${document} or email ${email} already exists`);

    const category = Customer.create({ name: name, document: document, email: email });
    await this.customersRepository.save(category);
  }
}