import { PaymentWebhookUseCase } from './payment-webhook.service'
import { InMemoryPaymentsRepository } from 'src/payments/persistence/in-memory/in-memory-payments.repository'
import { InMemoryOrdersRepository } from 'src/order/persistence/database/in-memory/in-memory-orders.repository'
import { Payment } from 'src/payments/domain/payment.entity'
import { Order } from 'src/order/domain/order.entity'
import { UpdatePaymentPort } from 'src/payments/domain/ports/update-payment.port'
import { PaymentStatus } from 'src/payments/domain/payment.entity'

let paymentsRepository: InMemoryPaymentsRepository
let ordersRepository: InMemoryOrdersRepository
let updatePaymentPort: UpdatePaymentPort
let sut: PaymentWebhookUseCase

describe('Payment Webhook UseCase', () => {
  beforeEach(() => {
    paymentsRepository = new InMemoryPaymentsRepository()
    ordersRepository = new InMemoryOrdersRepository()

    updatePaymentPort = {
      execute: jest.fn().mockResolvedValue(undefined),
    }

    sut = new PaymentWebhookUseCase(paymentsRepository, ordersRepository, updatePaymentPort)
  })

  it('should process approved payment and update order status to TO_PREPARE', async () => {
    const order = Order.create({ total: 100, status: 'AWAITING' })
    await ordersRepository.save(order)

    const payment = Payment.create({
      orderId: order.id,
      amount: 100,
      qrCode: 'qr-code',
      externalId: 'ext-123',
      status: PaymentStatus.PENDING,
    })
    await paymentsRepository.save(payment)

    await sut.execute({
      externalId: 'ext-123',
      status: 'payment.approved',
    })

    expect(updatePaymentPort.execute).toHaveBeenCalledWith({
      id: payment.id,
      payload: { status: PaymentStatus.APPROVED },
    })

    const updatedOrder = await ordersRepository.findById(order.id)
    expect(updatedOrder?.status).toBe('TO_PREPARE')
  })

  it('should process refunded payment and cancel the order', async () => {
    const order = Order.create({ total: 50, status: 'AWAITING' })
    await ordersRepository.save(order)

    const payment = Payment.create({
      orderId: order.id,
      amount: 50,
      qrCode: 'qr',
      externalId: 'ext-456',
      status: PaymentStatus.APPROVED,
    })
    await paymentsRepository.save(payment)

    await sut.execute({ externalId: 'ext-456', status: 'payment.refunded' })

    const updatedOrder = await ordersRepository.findById(order.id)
    expect(updatedOrder?.status).toBe('CANCELLED')
  })

  it('should throw if payment not found', async () => {
    await expect(
      sut.execute({ externalId: 'non-existent', status: 'payment.approved' }),
    ).rejects.toThrow('Payment not found')
  })

  it('should throw if order not found', async () => {
    const payment = Payment.create({
      orderId: 'non-existent-order',
      amount: 30,
      qrCode: 'qr',
      externalId: 'ext-789',
      status: PaymentStatus.PENDING,
    })

    await paymentsRepository.save(payment)

    await expect(
      sut.execute({ externalId: 'ext-789', status: 'payment.approved' }),
    ).rejects.toThrow('Order not found')
  })

  it('should throw if status is invalid', async () => {
    const order = Order.create({ total: 30, status: 'AWAITING' })
    await ordersRepository.save(order)

    const payment = Payment.create({
      orderId: order.id,
      amount: 30,
      qrCode: 'qr',
      externalId: 'ext-000',
      status: PaymentStatus.PENDING,
    })

    await paymentsRepository.save(payment)

    await expect(
      sut.execute({ externalId: 'ext-000', status: 'invalid_status' }),
    ).rejects.toThrow('Ivalid payment status')
  })
})
