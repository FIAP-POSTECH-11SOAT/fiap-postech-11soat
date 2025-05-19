import { Decimal } from '@prisma/client/runtime/library';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type PaymentProps = {
  orderId: UniqueEntityID;
  status: PaymentStatus;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
  amount: Decimal;
};

export type CreatePaymentProps = {
  id?: string;
  orderId: string;
  status?: PaymentStatus;
  qrCode: string;
  amount: Decimal;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Payment {
  private _id: UniqueEntityID;
  private props: PaymentProps;

  constructor(props: PaymentProps, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id(): string {
    return this._id.toString();
  }

  get orderId(): string {
    return this.props.orderId.toString();
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get qrCode(): string {
    return this.props.qrCode;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get amount(): Decimal {
    return this.props.amount;
  }

  set status(value: PaymentStatus) {
    this.props.status = value;
  }

  static create(props: CreatePaymentProps): Payment {
    const id = props.id ? new UniqueEntityID(props.id) : new UniqueEntityID();
    return new Payment(
      {
        orderId: new UniqueEntityID(props.orderId),
        status: props.status ?? 'PENDING',
        qrCode: props.qrCode,
        amount: props.amount,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
