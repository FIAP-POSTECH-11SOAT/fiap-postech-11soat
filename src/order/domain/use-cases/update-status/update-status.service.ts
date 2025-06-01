import { Injectable } from '@nestjs/common';
import { Order } from '../../order.entity';
import { OrderStatus } from 'src/shared/@types/OrderStatus';
import { OrdersRepository } from '../../ports/orders.repository';
import { PaymentsRepository } from 'src/payments/domain/ports/payments.repository';
import { UpdateStatusPort } from '../../ports/update-status.port';

@Injectable()
export class UpdateStatusUseCase implements UpdateStatusPort {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly paymentsRepository: PaymentsRepository
  ) { }

  private async validateStatusTransition(order: Order, newStatus: OrderStatus) {
    const { status: currentStatus, id } = order;
    if (
      (currentStatus === 'AWAITING' && ['AWAITING_PAYMENT', 'CANCELLED'].includes(newStatus)) ||
      (currentStatus === 'AWAITING_PAYMENT' && ['TO_PREPARE', 'CANCELLED'].includes(newStatus)) ||
      (currentStatus === 'TO_PREPARE' && newStatus === 'IN_PREPARE') ||
      (currentStatus === 'IN_PREPARE' && newStatus === 'FINISHED') ||
      (currentStatus === 'FINISHED' && newStatus === 'PICKUPED')
    ) {
      if (currentStatus === 'AWAITING_PAYMENT' && newStatus === 'TO_PREPARE') {
        const payment = await this.paymentsRepository.findByOrderId(id);
        if (payment && payment.status !== 'APPROVED') {
          throw new Error('Payment must be approved before proceeding');
        }
      }
      return;
    } else {
      throw new Error('Invalid status transition');
    }
  }

  async execute(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new Error('Invalid order');

    await this.validateStatusTransition(order, status);
    order.status = status;

    await this.ordersRepository.update(order);
  }
}
