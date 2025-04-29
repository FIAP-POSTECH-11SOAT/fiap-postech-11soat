import { Price } from '../../shared/entities/price';
import { UniqueEntityID } from '../../shared/entities/unique-entity-id';
import { ValidString } from '../../shared/entities/valid-string';
import { CreateItemProps, Item } from './item.entity';
import { randomUUID } from 'node:crypto';

const itemProps: CreateItemProps = {
  name: ValidString.create('Test Name'),
  description: ValidString.create('Test Description'),
  price: Price.create(10),
  image: ValidString.create('Test Image'),
  categoryId: new UniqueEntityID(),
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('ItemEntity', () => {
  it('should create an item', () => {
    const item = Item.create(itemProps);

    expect(item).toBeDefined();
    expect(item.name).toBe(itemProps.name.value());
    expect(item.description).toBe(itemProps.description.value());
    expect(item.price).toBe(itemProps.price.value());
    expect(item.image).toBe(itemProps.image?.value());
    expect(item.categoryId).toBe(itemProps.categoryId.toString());
    expect(item.createdAt).toBe(itemProps.createdAt);
    expect(item.updatedAt).toBe(itemProps.updatedAt);
    expect(item.deletedAt).toBe(null);
  });
  it('should create an item without image', () => {
    delete itemProps.image;
    const item = Item.create(itemProps);
    expect(item.image).toBe(null);
  });
  it('should create an item with deletedAt', () => {
    const deletedAt = new Date();
    const item = Item.create({ ...itemProps, deletedAt });
    expect(item.deletedAt).toBe(deletedAt);
  });
  it('should restore an item', () => {
    const id = randomUUID();
    const item = Item.create(itemProps, new UniqueEntityID(id));
    expect(item).toBeDefined();
    expect(item.id).toBe(id);
  });
});
