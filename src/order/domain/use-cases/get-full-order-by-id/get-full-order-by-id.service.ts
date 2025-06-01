import { FullOrder } from 'src/shared/@types/FullOrder';
import { GetFullOrderByIdPort } from '../../ports/get-full-order-by-id.port';
import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../../ports/orders.repository';

@Injectable()
export class GetFullOrderByIdUseCase implements GetFullOrderByIdPort {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) { }

  async execute(orderId: string): Promise<FullOrder | null> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    const items = await this.ordersRepository.findOrderItems(orderId);
    const customer = await this.ordersRepository.findCustomerOrder(orderId);
    return {
      items,
      order,
      customer: customer ? customer.customerId : null
    }
  }
}
