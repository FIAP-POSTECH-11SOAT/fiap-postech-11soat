import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../ports/customers.repository';
import { Customer } from '../customer.entity';

type GetCustomerUseCaseInput = {
  document: string;
};

@Injectable()
export class GetCustomerUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute({ document: document }: GetCustomerUseCaseInput): Promise<Customer | null> {
    const customer = await this.customersRepository.findByDocument(document);

    return customer
  }
}
