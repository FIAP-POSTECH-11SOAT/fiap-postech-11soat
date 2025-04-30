import { cpf } from 'cpf-cnpj-validator';
import { Optional } from 'src/shared/@types/optional';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export type CustomerProps = {
  name: string;
  document: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export class Customer {
  private _id: UniqueEntityID;
  private props: CustomerProps;

  constructor(props: CustomerProps, id?: UniqueEntityID) {
    this.validateDocument(props.document);
    this.props = props;
    this._id = id ? id : new UniqueEntityID();
  }

  private validateDocument(document: string): void {
    const cleanDocument = document.replace(/\D/g, '');
    
    if (!cpf.isValid(cleanDocument)) {
      throw new Error('Invalid CPF document');
    }
  }  

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this.props.name;
  }

  get document(): string {
    return this.props.document
  }

  get email(): string {
    return this.props.email
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  static create(
    props: Optional<CustomerProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Customer {
    const customer = new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
    return customer;
  }
}
