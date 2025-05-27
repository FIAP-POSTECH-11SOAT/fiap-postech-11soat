import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MercadoPagoService {
  private mercadopago: MercadoPagoConfig;
  private payment: Payment;

  constructor() {
    this.mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });

    this.payment = new Payment(this.mercadopago);
  }

  async createPixPayment(orderId: string, amount: number) {
    const payment = await this.payment.create({
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

    const poi = payment.point_of_interaction;
    const transactionData = poi?.transaction_data;

    if (!transactionData) {
      throw new Error('Transaction data não encontrada no retorno do Mercado Pago.');
    }

    const { qr_code, qr_code_base64, transaction_id } = transactionData;

    return {
      qrCode: qr_code,
      qrCodeBase64: qr_code_base64,
      externalId: String(transaction_id ?? payment.id), // fallback no id
      status: payment.status,
    };
  }
}
