import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomersRepository } from '../ports/customers.repository';
import { UpdateCustomerPort, UpdateCustomerProps } from '../ports/update-customer.port';
import { Customer } from '../customer.entity';

@Injectable()
export class UpdateCustomerUseCase implements UpdateCustomerPort {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute(document: string, updateItem: UpdateCustomerProps): Promise<Customer> {
    const customer = await this.customersRepository.findByDocument(document);

    if (!customer) throw new Error('Customer not found');

    if(updateItem.name) customer.name = updateItem.name;
    if(updateItem.email) customer.email = updateItem.email;

    await this.customersRepository.update(customer);

    return customer
  }
}
