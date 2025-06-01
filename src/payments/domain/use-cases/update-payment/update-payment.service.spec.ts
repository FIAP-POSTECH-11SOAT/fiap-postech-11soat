import { UpdatePaymentUseCase } from './update-payment.service'
import { InMemoryPaymentsRepository } from 'src/payments/persistence/in-memory/in-memory-payments.repository'
import { Payment } from 'src/payments/domain/payment.entity'
import { PaymentStatus } from 'src/payments/domain/payment.entity'

let paymentsRepository: InMemoryPaymentsRepository
let sut: UpdatePaymentUseCase

describe('Update Payment UseCase', () => {
  beforeEach(() => {
    paymentsRepository = new InMemoryPaymentsRepository()
    sut = new UpdatePaymentUseCase(paymentsRepository)
  })

  it('should update payment status if status is valid', async () => {
    const payment = Payment.create({
      orderId: 'order-123',
      amount: 100,
      qrCode: 'qr-abc',
      externalId: 'ext-xyz',
      status: PaymentStatus.PENDING,
    })

    await paymentsRepository.save(payment)

    await sut.execute({
      id: payment.id,
      payload: { status: PaymentStatus.APPROVED },
    })

    const updatedPayment = await paymentsRepository.findByOrderId('order-123')
    expect(updatedPayment).toBeDefined()
    expect(updatedPayment?.status).toBe(PaymentStatus.APPROVED)
  })

  it('should throw an error if status is invalid', async () => {
    const payment = Payment.create({
      orderId: 'order-123',
      amount: 100,
      qrCode: 'qr-abc',
      externalId: 'ext-xyz',
      status: PaymentStatus.PENDING,
    })

    await paymentsRepository.save(payment)

    await expect(
      sut.execute({
        id: payment.id,
        payload: { status: 'INVALID' as PaymentStatus },
      }),
    ).rejects.toThrow('Invalid payment status')
  })
})
