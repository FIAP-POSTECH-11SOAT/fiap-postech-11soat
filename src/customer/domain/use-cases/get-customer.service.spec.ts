import { InMemoryCustomersRepository } from 'src/customer/persistence/database/in-memory/in-memory-customers.repository';
import { GetCustomerUseCase } from './get-customer.service';
import { CreateCustomerUseCase } from './create-customer.service';
import { cpf as cpfGenerator } from 'cpf-cnpj-validator';

let inMemoryCustomersRepository: InMemoryCustomersRepository;
let getCustomerUseCase: GetCustomerUseCase;
let createCustomerUseCase: CreateCustomerUseCase;
let cpf: string;

describe('Get Customer Use Case', () => {
  beforeEach(() => {
    cpf = cpfGenerator.generate();
    inMemoryCustomersRepository = new InMemoryCustomersRepository();
    getCustomerUseCase = new GetCustomerUseCase(inMemoryCustomersRepository);
    createCustomerUseCase = new CreateCustomerUseCase(inMemoryCustomersRepository);

    createCustomerUseCase.execute({ name: 'Customer 1', document: cpf, email: 'test@mail.com' });
  });

  it('should be able to retrive a customer', async () => {
    const customer = await getCustomerUseCase.execute({ document: cpf });

    expect(customer?.document).toEqual(cpf);
  });

  it('should not be able to retrive a customer with wrong document', async () => {
    const wrong_document = cpfGenerator.generate();
    const customer = await getCustomerUseCase.execute({ document: wrong_document });

    expect(customer).toBeNull
  });
});
