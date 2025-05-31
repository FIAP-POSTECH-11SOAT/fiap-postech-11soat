import { GetPaymentByOrderIdUseCase } from './get-payment-by-order-id.service'
import { InMemoryPaymentsRepository } from 'src/payments/persistence/in-memory/in-memory-payments.repository'
import { Payment } from 'src/payments/domain/payment.entity'
import { PaymentStatus } from '@prisma/client'

let paymentsRepository: InMemoryPaymentsRepository
let sut: GetPaymentByOrderIdUseCase

describe('Get Payment By Order Id UseCase', () => {
  beforeEach(() => {
    paymentsRepository = new InMemoryPaymentsRepository()
    sut = new GetPaymentByOrderIdUseCase(paymentsRepository)
  })

  it('should return a payment if it exists for the given orderId', async () => {
    const payment = Payment.create({
      orderId: 'order-123',
      amount: 50,
      qrCode: 'fake-qr',
      externalId: 'external-123',
    })

    await paymentsRepository.save(payment)
    const result = await sut.execute('order-123')

    expect(result).toBeDefined()
    expect(result.orderId).toBe('order-123')
    expect(result.amount).toBe(50)
  })

  it('should throw if no payment is found for the given orderId', async () => {
    await expect(() => sut.execute('non-existing-order')).rejects.toThrow('Payment not found')
  })
})
