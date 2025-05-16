import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../../ports/orders.repository';
import { UpdateStatusPort } from '../../ports/update-status.port';
import { OrderStatus } from 'src/shared/@types/OrderStatus';

@Injectable()
export class UpdateStatusUseCase implements UpdateStatusPort {
  constructor(
    private readonly ordersRepository: OrdersRepository
  ) { }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus) {
    if (
      (currentStatus === 'AWAITING' && ['AWAITING_PAYMENT', 'CANCELLED'].includes(newStatus)) ||
      (currentStatus === 'AWAITING_PAYMENT' && ['TO_PREPARE', 'CANCELLED'].includes(newStatus)) ||
      (currentStatus === 'TO_PREPARE' && newStatus === 'IN_PREPARE') ||
      (currentStatus === 'IN_PREPARE' && newStatus === 'FINISHED') ||
      (currentStatus === 'FINISHED' && newStatus === 'PICKUPED')
    ) {
      return;
    } else {
      throw new Error('Invalid state transition');
    }
  }

  async execute(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Invalid order');

    this.validateStatusTransition(order.status, status);
    order.status = status;

    await this.ordersRepository.update(order);
  }
}
