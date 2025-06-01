import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomersRepository } from '../ports/customers.repository';
import { GetCustomerByDocumentPort } from '../ports/get-customer-by-document.port';
import { Customer } from '../customer.entity';

@Injectable()
export class GetCustomerUseCase implements GetCustomerByDocumentPort {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(document: string): Promise<Customer> {
    const customer = await this.customersRepository.findByDocument(document);

    if (!customer) {
      throw new NotFoundException(`Customer with document ${document} not found`);
    }

    return customer
  }
}
