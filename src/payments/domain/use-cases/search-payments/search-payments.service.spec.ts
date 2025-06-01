import { SearchPaymentsUseCase } from './search-payments.service'
import { InMemoryPaymentsRepository } from 'src/payments/persistence/in-memory/in-memory-payments.repository'
import { Payment, PaymentStatus } from 'src/payments/domain/payment.entity'

let paymentsRepository: InMemoryPaymentsRepository
let sut: SearchPaymentsUseCase

describe('SearchPaymentsUseCase', () => {
  beforeEach(() => {
    paymentsRepository = new InMemoryPaymentsRepository()
    sut = new SearchPaymentsUseCase(paymentsRepository)
  })

  it('should return all payments when no filters are applied', async () => {
    const payment1 = Payment.create({
      orderId: 'order-1',
      amount: 100,
      qrCode: 'qr-1',
      externalId: 'ext-1',
      status: PaymentStatus.APPROVED,
    })

    const payment2 = Payment.create({
      orderId: 'order-2',
      amount: 200,
      qrCode: 'qr-2',
      externalId: 'ext-2',
      status: PaymentStatus.PENDING,
    })

    await paymentsRepository.save(payment1)
    await paymentsRepository.save(payment2)

    const result = await sut.execute({})

    expect(result.total).toBe(2)
    expect(result.data).toHaveLength(2)
  })

  it('should filter payments by status', async () => {
    await paymentsRepository.save(
      Payment.create({
        orderId: 'order-1',
        amount: 100,
        qrCode: 'qr-1',
        externalId: 'ext-1',
        status: PaymentStatus.APPROVED,
      }),
    )

    await paymentsRepository.save(
      Payment.create({
        orderId: 'order-2',
        amount: 100,
        qrCode: 'qr-2',
        externalId: 'ext-2',
        status: PaymentStatus.PENDING,
      }),
    )

    const result = await sut.execute({ status: PaymentStatus.APPROVED })

    expect(result.total).toBe(1)
    expect(result.data[0].status).toBe('APPROVED')
  })
})
