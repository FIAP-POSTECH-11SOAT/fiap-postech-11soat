import { OrderStatus } from "src/shared/@types/OrderStatus";
import { UniqueEntityID } from "src/shared/entities/unique-entity-id";

type OrderProps = {
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrderProps = {
  id?: string;
  total: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
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

  get total(): number {
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

  set total(value: number) {
    this.props.total = value;
    this.touch();
  }

  set status(value: OrderStatus) {
    this.props.status = value;
    this.touch();
  }

  touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: CreateOrderProps): Order {
    const id = props.id ? new UniqueEntityID(props.id) : new UniqueEntityID();
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
