import { GetOrdersByFilterParams, GetOrdersByFilterPort } from '../../ports/get-orders-by-filter';

import { Injectable } from '@nestjs/common';
import { Order } from '../../order.entity';
import { OrdersRepository } from '../../ports/orders.repository';

@Injectable()
export class GetOrdersByFilterUseCase implements GetOrdersByFilterPort {
  constructor(
    private readonly ordersRepository: OrdersRepository,
  ) { }

  async execute(filter: GetOrdersByFilterParams): Promise<Order[]> {
    return this.ordersRepository.findOrdersByFilter(filter);
  }
}
