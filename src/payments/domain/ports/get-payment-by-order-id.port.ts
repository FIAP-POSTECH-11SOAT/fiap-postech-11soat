import { Payment } from "../payment.entity";

export abstract class GetPaymentByOrderIdPort {
  abstract execute(orderId: string): Promise<Payment>;
}
