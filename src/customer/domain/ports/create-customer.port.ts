import { Customer, CreateCustomerProps } from '../customer.entity';

export abstract class CreateCustomerPort {
  abstract execute(data: CreateCustomerProps): Promise<void>;
}
