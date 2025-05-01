import { Optional } from 'src/shared/@types/optional';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export type CategoryProps = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

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

  set name(name: string) {
    if (!name) throw new Error('Name is required');
    this.props.name = name;
    this.touch
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

  touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<CategoryProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Category {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
    return category;
  }

  softDelete(date: Date = new Date()) {
    if (this.deletedAt) throw new Error('Category already deleted');
    this.props.deletedAt = date;
  }
}
