import { randomUUID } from 'node:crypto';
import { UniqueEntityID } from './unique-entity-id';

describe('UniqueEntityID', () => {
  it('should create a new UniqueEntityID with a random UUID', () => {
    const uniqueEntityID = new UniqueEntityID();
    expect(uniqueEntityID).toBeDefined();
  });

  it('should create a new UniqueEntityID with a given UUID', () => {
    const uuid = randomUUID();
    const uniqueEntityID = new UniqueEntityID(uuid);
    expect(uniqueEntityID.toString()).toBe(uuid);
  });
});
