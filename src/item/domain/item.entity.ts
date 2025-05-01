import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../shared/entities/unique-entity-id';
import { Price } from '../../shared/entities/price';
import { ValidString } from '../../shared/entities/valid-string';

type ItemProps = {
  name: ValidString;
  description: ValidString;
  price: Price;
  image: ValidString | null;
  categoryId: UniqueEntityID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

// export type CreateItemProps = Optional<ItemProps, 'deletedAt' | 'image'>;

export type CreateItemProps = {
  id?: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

@Injectable()
export class Item {
  private _id: UniqueEntityID;
  private props: ItemProps;
  private constructor(props: ItemProps, id: UniqueEntityID) {
    this.props = props;
    this._id = id;
  }

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this.props.name.value();
  }

  get description(): string {
    return this.props.description.value();
  }

  get price(): number {
    return this.props.price.value();
  }

  get image(): string | null {
    return this.props.image?.value() ?? null;
  }

  get categoryId(): string {
    return this.props.categoryId.toString();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt ?? null;
  }

  static create(props: CreateItemProps): Item {
    const itemProps: ItemProps = {
      name: ValidString.create(props.name),
      description: ValidString.create(props.description),
      price: Price.create(props.price),
      image: props.image ? ValidString.create(props.image) : null,
      categoryId: new UniqueEntityID(props.categoryId),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? null,
    };
    const id = props.id ? new UniqueEntityID(props.id) : new UniqueEntityID();
    return new Item(itemProps, id);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
      categoryId: this.categoryId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
