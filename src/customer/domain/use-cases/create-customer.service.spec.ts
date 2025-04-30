import { InMemoryCustomersRepository } from 'src/customer/persistence/database/in-memory/in-memory-customers.repository';
import { CreateCustomerUseCase } from './create-customer.service';
import { cpf as cpfGenerator } from 'cpf-cnpj-validator';

let inMemoryCustomersRepository: InMemoryCustomersRepository;
let sut: CreateCustomerUseCase;

describe('Crate Customer Use Case', () => {
  const cpf = cpfGenerator.generate();

  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    sut = new CreateCustomerUseCase(inMemoryCustomersRepository);
  });

  it('should be able to create a customer', async () => {
    await sut.execute({ name: 'Customer 1', document: cpf, email: 'test@mail.com' });

    expect(inMemoryCustomersRepository.customers).toHaveLength(1);
    expect(inMemoryCustomersRepository.customers[0].name).toEqual('Customer 1');
    expect(inMemoryCustomersRepository.customers[0].document).toEqual(cpf);
    expect(inMemoryCustomersRepository.customers[0].email).toEqual('test@mail.com');
  });

  it('should not be able to create a customer with the same document', async () => {
    await sut.execute({ name: 'Customer 1', document: cpf, email: 'test_one@mail.com' });

    expect(() => sut.execute({ name: 'Customer 1', document: cpf, email: 'test_two@mail.com' })).rejects.toThrow(
      new Error(`Client with document ${cpf} or email test_two@mail.com already exists`),
    );
  });

  it('should not be able to create a customer with the same email', async () => {
    await sut.execute({ name: 'Customer 1', document: cpf, email: 'test_one@mail.com' });

    const cpf_two = cpfGenerator.generate();

    expect(() => sut.execute({ name: 'Customer 1', document: cpf_two, email: 'test_one@mail.com' })).rejects.toThrow(
      new Error(`Client with document ${cpf_two} or email test_one@mail.com already exists`),
    );
  });  
});
