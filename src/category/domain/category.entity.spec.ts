import { Category } from './category.entity';

describe('Category Entity', () => {
  it('should create a category', () => {
    const category = Category.create({
      name: 'Test Category',
    });

    expect(category).toBeDefined();
    expect(category.name).toBe('Test Category');
    expect(category.createdAt).toBeDefined();
    expect(category.updatedAt).toBeDefined();
    expect(category.deletedAt).toBe(null);
  });

  it('should restore a category', () => {
    const category = Category.create({
      id: 'category-1',
      name: 'Test Category',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(category).toBeDefined();
    expect(category.name).toBe('Test Category');
    expect(category.id).toBe('category-1');
  });

  it('should softDelete a category', () => {
    const category = Category.create({
      name: 'Test Category',
    });
    category.softDelete();

    expect(category.deletedAt).toBeDefined();
  });

  it('should throw an error when softDelete is called on an already deleted category', () => {
    const category = Category.create({
      name: 'Test Category',
    });
    category.softDelete();

    expect(() => category.softDelete()).toThrow(new Error('Category already deleted'));
  });

  it('should reactivate a category', () => {
    const category = Category.create({
      name: 'Test Category',
    });
    category.softDelete();
    category.reactivate();

    expect(category.deletedAt).toBeDefined();
  });

  it('should throw an error when reactivate is called on an active category', () => {
    const category = Category.create({
      name: 'Test Category',
    });

    expect(() => category.reactivate()).toThrow(new Error('Category is already active'));
  });
});
