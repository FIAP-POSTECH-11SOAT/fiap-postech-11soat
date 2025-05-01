import { GetItemsUseCase } from './get-items.service';
import { InMemoryItemsRepository } from '../../../persistence/in-memory/in-memory-items.repository';
import { Item } from '../../item.entity';
import { randomUUID } from 'node:crypto';

describe('GetItemsService', () => {
  let service: GetItemsUseCase;
  let inMemoryItemsRepository: InMemoryItemsRepository;

  beforeEach(() => {
    inMemoryItemsRepository = new InMemoryItemsRepository();
    service = new GetItemsUseCase(inMemoryItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get any items', async () => {
    const items = await service.execute();
    expect(items.length).toBe(0);
  });

  it('should get items', async () => {
    jest.spyOn(inMemoryItemsRepository, 'findAll').mockResolvedValue([
      Item.create({
        name: 'Test Name',
        description: 'Test Description',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Item.create({
        name: 'Test Name 2',
        description: 'Test Description 2',
        price: 10,
        categoryId: randomUUID(),
        image: 'Test Image 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]);
    const items = await service.execute();
    expect(items.length).toBe(2);
    expect(items[0].name).toBe('Test Name');
    expect(items[1].name).toBe('Test Name 2');
  });
});
