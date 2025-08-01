import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment } from 'mercadopago'

@Injectable()
export class MercadoPagoService {
  private _payment: Payment

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set');
    const sdk = new MercadoPagoConfig({ accessToken });
    this._payment = new Payment(sdk);
  }

  payment(): Payment {
    return this._payment
  }
}
