import { UniqueEntityID } from "src/shared/entities/unique-entity-id";

export type CustomerOrderProps = {
  orderId: UniqueEntityID;
  customerId: UniqueEntityID;
};

type CreateCustomerOrderProps = {
  orderId: string;
  customerId: string;
};

export class CustomerOrder {
  private props: CustomerOrderProps;

  constructor(props: CustomerOrderProps) {
    this.props = props;
  }

  get orderId(): string {
    return this.props.orderId.toString();
  }

  get customerId(): string {
    return this.props.customerId.toString();
  }

  static create(
    props: CreateCustomerOrderProps,
  ): CustomerOrder {
    const customerOrder = new CustomerOrder({
      customerId: new UniqueEntityID(props.customerId),
      orderId: new UniqueEntityID(props.orderId),
    });
    return customerOrder;
  }
}
