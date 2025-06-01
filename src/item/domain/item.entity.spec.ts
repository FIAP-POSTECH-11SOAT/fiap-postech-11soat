import { CreateItemProps, Item } from './item.entity';
import { randomUUID } from 'node:crypto';

const itemProps: CreateItemProps = {
  name: 'Test Name',
  description: 'Test Description',
  price: 10,
  image: '/public/test.png',
  categoryId: randomUUID(),
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('ItemEntity', () => {
  it('should create an item', () => {
    const item = Item.create(itemProps);
    expect(item).toBeDefined();
    expect(item.name).toBe(itemProps.name);
    expect(item.description).toBe(itemProps.description);
    expect(item.price).toBe(itemProps.price);
    expect(item.image).toBe(itemProps.image);
    expect(item.categoryId).toBe(itemProps.categoryId);
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
    const item = Item.create({
      ...itemProps,
      id,
    });
    expect(item).toBeDefined();
    expect(item.id).toBe(id);
  });
  it('should softDelete an item', () => {
    const item = Item.create({
      ...itemProps,
    });
    item.softDelete();
    expect(item.deletedAt).toBeDefined();
  });
  it('should throw an error when trying to softDelete an item that is already deleted', () => {
    const item = Item.create({
      ...itemProps,
      deletedAt: new Date(),
    });
    expect(() => item.softDelete()).toThrow(new Error('Item already deleted'));
  });
  it('should update an item', () => {
    const item = Item.create({
      ...itemProps,
    });

    const newCategoryId = randomUUID();

    item.name = 'Updated Name';
    item.description = 'Updated Description';
    item.price = 20;
    item.image = '/public/updated.png';
    item.categoryId = newCategoryId;

    expect(item.name).toBe('Updated Name');
    expect(item.description).toBe('Updated Description');
    expect(item.price).toBe(20);
    expect(item.image).toBe('/public/updated.png');
    expect(item.categoryId).toBe(newCategoryId);
  });
  it('should activate an item', () => {
    const item = Item.create({
      ...itemProps,
      deletedAt: new Date(),
    });
    item.activate();
    expect(item.deletedAt).toBe(null);
  });
});
