import { FullOrder } from "src/shared/@types/FullOrder";
import { OrderPresenter } from "./order.presenter";

export class FullOrderPresenter {
  static toHTTP(fullOrder: FullOrder) {
    return {
      order: OrderPresenter.toHTTP(fullOrder.order),
      items: fullOrder.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price
      })),
      customerId: fullOrder.customer
    }
  }
}