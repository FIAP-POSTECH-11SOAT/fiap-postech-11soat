import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { ValidString } from 'src/shared/entities/valid-string';

type CategoryProps = {
  name: ValidString;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type CreateCategoryProps = {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export class Category {
  private _id: UniqueEntityID;
  private props: CategoryProps;

  private constructor(props: CategoryProps, id: UniqueEntityID) {
    this.props = props;
    this._id = id;
  }

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this.props.name.value();
  }

  set name(name: string) {
    if (!name) throw new Error('Name is required');
    this.props.name = ValidString.create(name);
    this.touch
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

  touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: CreateCategoryProps): Category {
    const category = new Category(
      {
        name: ValidString.create(props.name),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      props.id ? new UniqueEntityID(props.id) : new UniqueEntityID(),
    );
    return category;
  }

  softDelete(date: Date = new Date()) {
    if (this.deletedAt) throw new Error('Category already deleted');
    this.props.deletedAt = date;
  }
}
