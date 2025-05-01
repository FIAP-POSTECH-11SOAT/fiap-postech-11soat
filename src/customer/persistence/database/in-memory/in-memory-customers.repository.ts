import { Customer } from 'src/customer/domain/customer.entity';
import { CustomersRepository } from 'src/customer/domain/ports/customers.repository';

export class InMemoryCustomersRepository implements CustomersRepository {
  customers: Customer[] = [];

  async existsByDocumentOrEmail(document: string, email: string): Promise<boolean> {
    return this.customers.some(
      customer => customer.document === document || customer.email === email
    );
  }

  async save(customer: Customer): Promise<void> {
    this.customers.push(customer);
  }
}
