import { InMemoryItemsRepository } from '../../persistence/in-memory/in-memory-items.repository';
import { CreateItemProps } from '../item.entity';
import { CreateItemUseCase } from './create-item.service';

let inMemoryItemsRepository: InMemoryItemsRepository;
let sut: CreateItemUseCase;

describe('Create Item Use Case', () => {
  beforeEach(() => {
    inMemoryItemsRepository = new InMemoryItemsRepository();
    sut = new CreateItemUseCase(inMemoryItemsRepository);
  });
  it('should create an item', async () => {
    const createItemProps: CreateItemProps = {
      name: 'Test Name',
      description: 'Test Description',
      price: 10,
      categoryId: 'Test Category ID',
      image: 'Test Image',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const item = await sut.execute(createItemProps);
    expect(item).toBeDefined();
    expect(inMemoryItemsRepository.items).toHaveLength(1);
    expect(inMemoryItemsRepository.items[0].name).toBe('Test Name');
  });
  it('should create an item without image', async () => {
    const createItemProps: CreateItemProps = {
      name: 'Test Name',
      description: 'Test Description',
      price: 10,
      categoryId: 'Test Category ID',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    delete createItemProps.image;
    const item = await sut.execute(createItemProps);
    expect(item.image).toBe(null);
  });
  it('should throw an error if item with this name already exists', async () => {
    const createItemProps: CreateItemProps = {
      name: 'Test Name',
      description: 'Test Description',
      price: 10,
      categoryId: 'Test Category ID',
      image: 'Test Image',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await sut.execute(createItemProps);
    await expect(() => sut.execute(createItemProps)).rejects.toThrow(
      new Error('Item with this name already exists'),
    );
  });
});
