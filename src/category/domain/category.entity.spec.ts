import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { Category } from './category.entity';

describe('Category Entity', () => {
  it('should create a category', () => {
    const category = Category.create({
      name: 'Test Category',
    });

    expect(category).toBeDefined();
    expect(category.name).toBe('Test Category');
  });

  it('should restore a category', () => {
    const category = new Category(
      {
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID('category-1'),
    );

    expect(category).toBeDefined();
    expect(category.name).toBe('Test Category');
    expect(category.id).toBe('category-1');
  });

  it('should soft delete the category', () => {
    const category = new Category(
      {
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID('category-1'),
    );

    category.softDelete();

    expect(category.deletedAt).toBeDefined();
  });
});
