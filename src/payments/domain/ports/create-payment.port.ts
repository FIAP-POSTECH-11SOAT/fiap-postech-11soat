export abstract class CreatePaymentPort {
  abstract execute(orderId: string): Promise<string>;
}
