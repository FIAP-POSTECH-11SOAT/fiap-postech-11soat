import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '../../shared/entities/unique-entity-id';
import { Optional } from '../../shared/@types/optional';
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

export type CreateItemProps = Optional<ItemProps, 'deletedAt' | 'image'>;

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

  static create(props: CreateItemProps, id?: UniqueEntityID): Item {
    return new Item(
      {
        ...props,
        image: props.image ?? null,
        deletedAt: props.deletedAt ?? null,
      },
      id ?? new UniqueEntityID(),
    );
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
