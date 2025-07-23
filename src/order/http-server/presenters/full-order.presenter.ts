import { FullOrder } from "src/shared/@types/FullOrder";
import { Injectable } from "@nestjs/common";
import { OrderPresenter } from "./order.presenter";

@Injectable()
export class FullOrderPresenter {
  constructor(private readonly orderPresenter: OrderPresenter) {}

  toHTTP(fullOrder: FullOrder) {
    return {
      order: this.orderPresenter.toHTTP(fullOrder.order),
      items: fullOrder.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price
      })),
      customerId: fullOrder.customer
    }
  }
}