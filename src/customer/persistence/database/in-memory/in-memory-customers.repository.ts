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

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.document === document);
    if (!customer) return null;
    return customer;
  }

  async update(customer: Customer): Promise<void> {
    const document = customer.document;
    const customer_founded = this.customers.find((customer) => customer.document === document);

    if(!customer_founded) return 

    customer_founded.email = customer.email
    customer_founded.name = customer.name

    return
  }  
}
