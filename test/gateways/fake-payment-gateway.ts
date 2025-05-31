import { PaymentGatewayPort } from "src/payments/domain/ports/payment-gateway.port";

export class FakePaymentGateway implements PaymentGatewayPort {
  async createPixPayment(orderId: string, amount: number) {
    return {
      externalId: 'external-id-123',
      qrCode: 'qr-code-123',
      qrCodeBase64: 'base64-code-123',
      status: 'PENDING',
    }
  }
}