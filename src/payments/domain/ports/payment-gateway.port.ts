import { PaymentStatus } from "../payment.entity"

export interface PaymentGatewayOutput {
  externalId: string
  qrCode: string
  qrCodeBase64: string
  status: string
}

export abstract class PaymentGatewayPort {
  abstract createPixPayment(orderId: string, amount: number): Promise<PaymentGatewayOutput>
  abstract getPaymentStatusByExternalId(externalId: string): Promise<PaymentStatus>
}