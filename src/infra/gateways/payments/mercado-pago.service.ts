import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { PaymentGatewayOutput, PaymentGatewayPort } from 'src/payments/domain/ports/payment-gateway.port';

@Injectable()
export class MercadoPagoService implements PaymentGatewayPort {
  private readonly payment: Payment;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set');
    const mercadopago = new MercadoPagoConfig({ accessToken });
    this.payment = new Payment(mercadopago);
  }

  async createPixPayment(
    orderId: string,
    amount: number,
  ): Promise<PaymentGatewayOutput> {
    const response = await this.payment.create({
      body: {
        transaction_amount: amount,
        description: `Pagamento do pedido ${orderId}`,
        payment_method_id: 'pix',
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
}
