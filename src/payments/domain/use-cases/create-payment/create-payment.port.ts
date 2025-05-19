import { CreatePaymentProps } from '../../payment.entity';

export abstract class CreatePaymentPort {
  abstract execute(props: CreatePaymentProps): Promise<string>;
}
