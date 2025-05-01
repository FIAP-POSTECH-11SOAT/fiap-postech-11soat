export class ValidString {
  private _value: string;
  private constructor(value: string) {
    this._value = value;
  }
  static create(value: string): ValidString {
    if (value === '' || !value.replace(/\s/g, '').length)
      throw new Error('Invalid string');
    return new ValidString(value);
  }
  value(): string {
    return this._value;
  }
}
