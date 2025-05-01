export class Price {
  private _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  value(): number {
    return this._value;
  }

  static create(value: number): Price {
    if (value <= 0) throw new Error('Price must be greater than zero');
    return new Price(value);
  }
}
