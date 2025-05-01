import { ValidString } from './valid-string';

describe('ValidString', () => {
  it('should create a valid string', () => {
    const validString = ValidString.create('valid string');
    expect(validString.value()).toBe('valid string');
  });

  it('should not create a valid string with empty value', () => {
    expect(() => {
      ValidString.create('');
    }).toThrow('Invalid string');
  });

  it('should not create a valid string with only spaces', () => {
    expect(() => {
      ValidString.create('   ');
    }).toThrow('Invalid string');
  });
});
