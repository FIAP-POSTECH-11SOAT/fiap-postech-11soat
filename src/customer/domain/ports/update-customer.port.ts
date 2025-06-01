import { Customer, CustomerProps } from '../customer.entity';

export type UpdateCustomerProps = Partial<
  Omit<CustomerProps, 'document' | 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'>
>;

export abstract class UpdateCustomerPort {
  abstract execute(document: string, updateItem: UpdateCustomerProps): Promise<Customer>;
}

