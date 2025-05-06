import { Prisma, CustomerOrder as PrismaCustomerOrder } from '@prisma/client';

import { CustomerOrder } from 'src/order/domain/customer-order.entity';

export class PrismaCustomerOrderMapper {
  static toDomain(raw: PrismaCustomerOrder): CustomerOrder {
    return CustomerOrder.create(
      {
        orderId: raw.orderId,
        customerId: raw.customerId,
      },
    );
  }

  static toPrisma(customerOrder: CustomerOrder): Prisma.CustomerOrderUncheckedCreateInput {
    return {
      orderId: customerOrder.orderId,
      customerId: customerOrder.customerId,
    };
  }
}
