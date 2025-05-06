import { Decimal } from "@prisma/client/runtime/library";
import { UniqueEntityID } from "src/shared/entities/unique-entity-id";

export type OrderItemProps = {
  orderId: UniqueEntityID;
  itemId: UniqueEntityID;
  price: Decimal;
  quantity: number;
};

type CreateOrderItemProps = {
  orderId: string;
  itemId: string;
  price: Decimal;
  quantity: number;
};

export class OrderItem {
  private props: OrderItemProps;

  constructor(props: OrderItemProps) {
    this.props = props;
  }

  get orderId(): string {
    return this.props.orderId.toString();
  }

  get itemId(): string {
    return this.props.itemId.toString();
  }

  get price(): Decimal {
    return this.props.price;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  static create(
    props: CreateOrderItemProps,
  ): OrderItem {
    const orderItem = new OrderItem({
      itemId: new UniqueEntityID(props.itemId),
      orderId: new UniqueEntityID(props.orderId),
      price: props.price,
      quantity: props.quantity,
    });
    return orderItem;
  }
}
