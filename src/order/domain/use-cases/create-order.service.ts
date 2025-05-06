import { CustomerOrder } from '../customer-order.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { Injectable } from '@nestjs/common';
import { Order } from '../order.entity';
import { OrderStatus } from '@prisma/client';
import { OrdersRepository } from '../ports/orders.repository';

type CreateOrderUseCaseInput = {
  customerId: string;
};

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) { }

  async execute({ customerId }: CreateOrderUseCaseInput): Promise<string> {
    const order = Order.create({ total: new Decimal(0), status: OrderStatus.AWAITING });
    return await this.ordersRepository.save(order, customerId);
  }
}
