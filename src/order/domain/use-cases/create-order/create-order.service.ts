import { CreateOrderPort } from '../../ports/create-order.port';
import { CustomerOrder } from '../../customer-order.entity';
import { Injectable } from '@nestjs/common';
import { Order } from '../../order.entity';
import { OrdersRepository } from '../../ports/orders.repository';

@Injectable()
export class CreateOrderUseCase implements CreateOrderPort {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) { }

  async execute(customerId?: string): Promise<string> {
    const order = Order.create({ total: 0, status: 'AWAITING' });
    if (customerId) {
      const customerOrder = CustomerOrder.create({
        customerId: customerId,
        orderId: order.id,
      });
      return await this.ordersRepository.save(order, customerOrder);
    } else {
      return await this.ordersRepository.save(order);
    }
  }
}
