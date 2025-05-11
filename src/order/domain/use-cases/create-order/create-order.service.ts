import { CreateOrderPort } from '../../ports/create-order.port';
import { Decimal } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { Order } from '../../order.entity';
import { OrdersRepository } from '../../ports/orders.repository';

@Injectable()
export class CreateOrderUseCase implements CreateOrderPort {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) { }

  async execute(customerId: string): Promise<string> {
    const order = Order.create({ total: new Decimal(0), status: 'AWAITING' });
    return await this.ordersRepository.save(order, customerId);
  }
}
