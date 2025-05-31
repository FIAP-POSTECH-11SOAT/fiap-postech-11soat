import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { zodToOpenAPI } from 'nestjs-zod';

import { SearchPaymentsUseCase } from '../domain/use-cases/search-payments/search-payments.service';
import { HandlePaymentWebhookUseCase } from '../domain/use-cases/handle-payment-webhook/handle-payment-webhook.service';

const webhookPaymentBodySchema = z.object({
  data: z.object({
    id: z.string(),
  }),
  type: z.string(),
});

@Controller('/payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(
    private readonly handlePaymentWebhookUseCase: HandlePaymentWebhookUseCase,
  ) { }

  @Post('/webhook')
  @HttpCode(200)
  @ApiBody({ schema: zodToOpenAPI(webhookPaymentBodySchema) })
  @ApiOperation({
    summary: 'Receives payment updates from MercadoPago',
    description: `
This endpoint is called by MercadoPago when there are changes in the status of a payment.

- The 'data.id' field is used to search for the payment.
- The 'type' field defines the type of event (e.g. payment.approved).
- Updates the payment status in the system according to the event.

⚠️ Important: This endpoint is used exclusively for integration with MercadoPago webhooks.`,
  })
  @ApiResponse({ status: 200, description: 'Webhook processado com sucesso' })
  async handleWebhook(@Body() body: z.infer<typeof webhookPaymentBodySchema>) {
    try {
      const { id: externalId } = body.data;
      const eventType = body.type;

      if (!externalId || !eventType) {
        throw new Error('Payload inválido');
      }

      const result = await this.handlePaymentWebhookUseCase.execute(
        externalId,
        eventType,
      );

      return result;
    } catch (error) {
      console.error('Erro no webhook:', error);
      throw new UnprocessableEntityException(error.message);
    }
  }
}
