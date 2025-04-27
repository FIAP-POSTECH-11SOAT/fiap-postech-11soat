import { Injectable } from '@nestjs/common';
import { Optional } from 'src/shared/@types/optional';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export type CategoryProps = {
  name: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

@Injectable()
export class Category {
  private _id: UniqueEntityID;
  private props: CategoryProps;

  constructor(props: CategoryProps, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ? id : new UniqueEntityID();
  }

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  static create(
    props: Optional<CategoryProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Category {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return category;
  }
}
