import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderStatusClient {
  constructor(private readonly httpService: HttpService) {}

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await firstValueFrom(
      this.httpService.put('/orders/status', { orderId, status }),
    );
  }
}
