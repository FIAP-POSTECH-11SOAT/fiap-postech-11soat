import { Payment, PaymentStatus } from './payment.entity'
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id'

describe('Payment Entity', () => {
  it('should create a payment with all properties set', () => {
    const orderId = new UniqueEntityID()
    const payment = Payment.create({
      orderId: orderId.toString(),
      qrCode: 'mock-qr-code',
      amount: 100,
      status: PaymentStatus.APPROVED,
      externalId: 'ext-123',
    })

    expect(payment).toBeInstanceOf(Payment)
    expect(payment.orderId).toBe(orderId.toString())
    expect(payment.status).toBe(PaymentStatus.APPROVED)
    expect(payment.qrCode).toBe('mock-qr-code')
    expect(payment.amount).toBe(100)
    expect(payment.externalId).toBe('ext-123')
    expect(payment.createdAt).toBeInstanceOf(Date)
    expect(payment.updatedAt).toBeInstanceOf(Date)
  })

  it('should default to PENDING status when not provided', () => {
    const payment = Payment.create({
      orderId: new UniqueEntityID().toString(),
      qrCode: 'code',
      amount: 50,
    })

    expect(payment.status).toBe(PaymentStatus.PENDING)
  })

  it('should update status and updatedAt when using setter', () => {
    const payment = Payment.create({
      orderId: new UniqueEntityID().toString(),
      qrCode: 'initial',
      amount: 200,
    })

    const oldDate = payment.updatedAt
    payment.status = PaymentStatus.APPROVED

    expect(payment.status).toBe(PaymentStatus.APPROVED)
    expect(payment.updatedAt.getTime()).toBeGreaterThanOrEqual(oldDate.getTime())
  })

  it('should update status and updatedAt using update()', () => {
    const payment = Payment.create({
      orderId: new UniqueEntityID().toString(),
      qrCode: 'initial',
      amount: 300,
    })

    const before = payment.updatedAt
    payment.update({ status: PaymentStatus.REFUNDED })

    expect(payment.status).toBe(PaymentStatus.REFUNDED)
    expect(payment.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
  })

  it('should preserve provided createdAt and updatedAt values', () => {
    const now = new Date()
    const payment = Payment.create({
      orderId: new UniqueEntityID().toString(),
      qrCode: 'with-date',
      amount: 100,
      createdAt: now,
      updatedAt: now,
    })

    expect(payment.createdAt).toBe(now)
    expect(payment.updatedAt).toBe(now)
  })
})
