import { PaymentStatus } from "src/payments/domain/payment.entity";
import { PaymentGatewayPort } from "src/payments/domain/ports/payment-gateway.port";

export class FakePaymentGateway implements PaymentGatewayPort {
  private statuses = new Map<string, PaymentStatus>()

  async createPixPayment(orderId: string, amount: number) {
    return {
      externalId: 'external-id-123',
      qrCode: 'qr-code-123',
      qrCodeBase64: 'base64-code-123',
      status: 'PENDING',
    }
  }

  async getPaymentStatusByExternalId(externalId: string): Promise<PaymentStatus> {
    const status = this.statuses.get(externalId)
    if (!status) {
      throw new Error('Invalid payment status')
    }
    return status
  }

  setPaymentStatus(externalId: string, status: PaymentStatus) {
    this.statuses.set(externalId, status)
  }
}