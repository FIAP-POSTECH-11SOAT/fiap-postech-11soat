import { InMemoryPaymentsRepository } from 'src/payments/persistence/in-memory/in-memory-payments.repository';
import { CreatePaymentUseCase } from './create-payment.service';
import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository';
import { FakePaymentGateway } from 'test/gateways/fake-payment-gateway';
import { Order } from 'src/order/domain/order.entity';

let inMemoryPaymentsRepository: InMemoryPaymentsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let paymentGateway: FakePaymentGateway;
let sut: CreatePaymentUseCase;

describe('Crate Payment Use Case', () => {
  beforeEach(() => {
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    paymentGateway = new FakePaymentGateway();
    sut = new CreatePaymentUseCase(inMemoryOrdersRepository, inMemoryPaymentsRepository, paymentGateway);
  });

  it('should create a payment when order is valid and awaiting', async () => {
    const order = Order.create({
      total: 10,
      status: 'AWAITING',
    });
    await inMemoryOrdersRepository.save(order);
    const paymentId = await sut.execute(order.id)
    expect(inMemoryPaymentsRepository.payments.length).toBe(1)
    expect(inMemoryPaymentsRepository.payments[0].amount).toBe(10)
    expect(paymentId).toBeDefined()
  })

  it('should not create a payment when order is not with status awaiting', async () => {
    const order = Order.create({
      total: 10,
      status: 'AWAITING_PAYMENT',
    });
    await inMemoryOrdersRepository.save(order);
    expect(() => sut.execute(order.id)).rejects.toThrow(
      new Error(`Cannot create payment for order with status ${order.status}`),
    );
  })
});
