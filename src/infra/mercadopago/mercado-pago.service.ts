import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export interface PixPaymentResponse {
  qrCode: string;
  qrCodeBase64: string;
  externalId: string;
  status: string;
}

@Injectable()
export class MercadoPagoService {
  private readonly payment: Payment;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>(
      'MERCADO_PAGO_ACCESS_TOKEN',
    );

    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set');
    }

    const mercadopago = new MercadoPagoConfig({ accessToken });
    this.payment = new Payment(mercadopago);
  }

  async createPixPayment(
    orderId: string,
    amount: number,
  ): Promise<PixPaymentResponse> {
    const result = await this.payment.create({
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
    });

    const transactionData = (result as any).point_of_interaction
      ?.transaction_data;

    if (!transactionData) {
      throw new Error(
        'Transaction data não encontrada no retorno do Mercado Pago.',
      );
    }

    const {
      qr_code,
      qr_code_base64,
      transaction_id,
    }: {
      qr_code: string;
      qr_code_base64: string;
      transaction_id: string;
    } = transactionData;

    if (!qr_code || !qr_code_base64) {
      throw new Error('QR Code ou QR Code Base64 não recebido do MercadoPago');
    }

    return {
      qrCode: qr_code,
      qrCodeBase64: qr_code_base64,
      externalId: String(transaction_id ?? (result as any).id ?? ''),
      status: (result as any).status ?? 'PENDING',
    };
  }
}
