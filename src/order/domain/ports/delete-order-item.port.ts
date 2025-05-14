export abstract class DeleteOrderItemPort {
  abstract execute(orderId: string, itemId: string): Promise<void>
}
