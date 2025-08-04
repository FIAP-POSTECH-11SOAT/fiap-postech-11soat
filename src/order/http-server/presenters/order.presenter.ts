import { Order } from "../../domain/order.entity";

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      orderId: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}