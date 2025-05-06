import { Decimal } from "@prisma/client/runtime/library";
import { Optional } from "src/shared/@types/optional";
import { OrderStatus } from "@prisma/client";
import { UniqueEntityID } from "src/shared/entities/unique-entity-id";

export type OrderProps = {
  total: Decimal;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class Order {
  private _id: UniqueEntityID;
  private props: OrderProps;

  constructor(props: OrderProps, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ? id : new UniqueEntityID();
  }

  get id(): string {
    return this._id.toString();
  }

  get total(): Decimal {
    return this.props.total;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Order {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
    return order;
  }
}
