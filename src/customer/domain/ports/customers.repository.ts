import { Customer } from 'src/customer/domain/customer.entity';

export abstract class CustomersRepository {
  abstract save(customer: Customer): Promise<void>;
  abstract existsByDocumentOrEmail(params: { document: string, email: string }): Promise<boolean>;
}
