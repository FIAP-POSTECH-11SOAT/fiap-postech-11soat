import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { Category } from './category.entity';
import { randomUUID } from 'node:crypto';
import { cpf } from 'cpf-cnpj-validator';

describe('Category Entity', () => {
  it('should create a category', () => {
    const category = Category.create({
      name: 'Test Category',
    });

    expect(category).toBeDefined();
    expect(category.name).toBe('Test Category');
  });

  it('should restore a category', () => {
    const id = randomUUID();
    const category = new Category(
      {
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(id),
    );

    expect(category).toBeDefined();
    expect(category.name).toBe('Test Category');
    expect(category.id.toString()).toBe(id);
  });
});
