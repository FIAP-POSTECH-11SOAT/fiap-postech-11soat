import { Price } from './price';

describe('Should create a price', () => {
  it('should create a price', () => {
    const price = Price.create(10.5);
    expect(price.value()).toBe(10.5);
  });

  it('should not create a price with negative value', () => {
    expect(() => {
      Price.create(-1);
    }).toThrow('Price must be greater than zero');
  });

  it('should not create a price with zero', () => {
    expect(() => {
      Price.create(0);
    }).toThrow('Price must be greater than zero');
  });

  it('should get a price', () => {
    const price = Price.create(10.5);
    expect(price.value()).toBe(10.5);
  });
});
