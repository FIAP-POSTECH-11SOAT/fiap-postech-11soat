import { Payment } from "../domain/payment.entity";

export class PaymentPresenter {
  static toHTTP(payment: Payment) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      externalId: payment.externalId,
      status: payment.status,
      amount: payment.amount,
      qrCode: payment.qrCode,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  }

  static toCreated(paymentId: string) {
    return {
      id: paymentId,
    }
  }
}
