import { Customer } from '../customer.entity';

export abstract class GetCustomerByDocumentPort {
  abstract execute(document: string): Promise<Customer>;
}
