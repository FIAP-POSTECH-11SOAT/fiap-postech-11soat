import { CreatePaymentProps } from '../payment.entity';

export abstract class CreatePaymentPort {
  abstract execute(orderId: string): Promise<string>;
}
