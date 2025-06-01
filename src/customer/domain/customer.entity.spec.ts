import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';
import { Customer } from './customer.entity';
import { randomUUID } from 'node:crypto';
import { cpf as cpfGenerator } from 'cpf-cnpj-validator'; 

describe('Customer Entity', () => {
  it('should create a customer', () => {
    const cpf = cpfGenerator.generate();
    const customer = Customer.create({
      document: cpf,
      email: 'teste@mail.com',
      name: 'User Name'
    });

    expect(customer).toBeDefined();
    expect(customer.document).toBe(cpf);
    expect(customer.email).toBe('teste@mail.com');
    expect(customer.name).toBe('User Name');
  });

  it('should restore a customer', () => {
    const id = randomUUID();
    const cpf = cpfGenerator.generate();
    const customer = new Customer(
      {
        document: cpf,
        email: 'teste@mail.com',
        name: 'User Name',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(id),
    );

    expect(customer).toBeDefined();
    expect(customer.document).toBe(cpf);
    expect(customer.email).toBe('teste@mail.com');
    expect(customer.name).toBe('User Name');    
    expect(customer.id.toString()).toBe(id);
  });

  it('should raise error', () => {
    expect(() => {
      new Customer(
        {
          document: '12345678911',
          email: 'teste@mail.com',
          name: 'User Name',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        new UniqueEntityID(randomUUID()),
      );
    }).toThrow('Invalid CPF document');
  });
});
