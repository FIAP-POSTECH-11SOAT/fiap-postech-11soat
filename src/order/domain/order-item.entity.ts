import { UniqueEntityID } from "src/shared/entities/unique-entity-id";

type OrderItemProps = {
  orderId: UniqueEntityID;
  itemId: UniqueEntityID;
  price: number;
  quantity: number;
};

export type CreateOrderItemProps = {
  orderId: string;
  itemId: string;
  price: number;
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

  get price(): number {
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

  toJSON() {
    return {
      orderId: this.orderId,
      itemId: this.itemId,
      price: this.price,
      quantity: this.quantity
    };
  }
}
