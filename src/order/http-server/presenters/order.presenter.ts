import { Injectable } from "@nestjs/common";
import { Order } from "../../domain/order.entity";

@Injectable()
export class OrderPresenter {
  toHTTP(order: Order) {
    return {
      orderId: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}