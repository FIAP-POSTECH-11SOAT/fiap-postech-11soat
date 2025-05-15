export abstract class CreateOrderPort {
  abstract execute(customerId?: string): Promise<string>;
}
