import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment as MercadoPagoPayment } from 'mercadopago';
import { PaymentStatus } from 'src/payments/domain/payment.entity';
import { PaymentGatewayOutput, PaymentGatewayPort } from 'src/payments/domain/ports/payment-gateway.port';
import { MercadoPagoService } from './mercaddo-pago.service';

@Injectable()
export class MercadoPagoGateway implements PaymentGatewayPort {
  constructor(private readonly mercadoPagoService: MercadoPagoService) { }

  async createPixPayment(
    orderId: string,
    amount: number,
  ): Promise<PaymentGatewayOutput> {
    const now = new Date()
    const TEN_MINUTES = 10 * 60 * 1000
    const dataValidadeQrCode = new Date(now.getTime() + TEN_MINUTES).toISOString()

    const response = await this.mercadoPagoService.payment().create({
      requestOptions: {
        idempotencyKey: orderId,
      },
      body: {
        external_reference: orderId,
        transaction_amount: amount,
        description: `Pagamento do pedido ${orderId}`,
        payment_method_id: 'pix',
        notification_url: 'https://webhook.site/fc0a9a75-6f24-4224-8d56-8c9fa0003c85',
        date_of_expiration: dataValidadeQrCode,
        payer: {
          email: 'comprador@teste.com',
          first_name: 'Comprador',
          last_name: 'Teste',
          identification: {
            type: 'CPF',
            number: '12345678909',
          },
        },
      },
    })

    const pointOfInteraction = (response as any).point_of_interaction
    const transactionData = pointOfInteraction?.transaction_data

    if (!transactionData?.qr_code || !transactionData.qr_code_base64) {
      throw new Error('QR Code data not found in Mercado Pago response.')
    }

    return {
      qrCode: transactionData.qr_code,
      qrCodeBase64: transactionData.qr_code_base64,
      externalId: String(transactionData.transaction_id ?? (response as any).id ?? ''),
      status: (response as any).status ?? 'PENDING',
    }
  }

  async getPaymentStatusByExternalId(externalId: string): Promise<PaymentStatus> {
    const response = await this.mercadoPagoService.payment().get({ id: externalId })
    const status = this.mapStatus(response.status)
    return status
  }

  private mapStatus(status?: string): PaymentStatus {
    if (!status) throw new Error('Invalid payment status from Mercado Pago')

    const statusMap: Record<string, PaymentStatus> = {
      'created': PaymentStatus.PENDING,
      'pending': PaymentStatus.PENDING,
      'updated': PaymentStatus.APPROVED,
      'in_process': PaymentStatus.PENDING,
      'authorized': PaymentStatus.APPROVED,
      'approved': PaymentStatus.APPROVED,
      'refunded': PaymentStatus.REFUNDED,
      'cancelled': PaymentStatus.FAILED,
      'rejected': PaymentStatus.FAILED,
    }
    const mapped = statusMap[status]

    if (!mapped) throw new Error('Invalid payment status from Mercado Pago')

    return mapped
  }
}
