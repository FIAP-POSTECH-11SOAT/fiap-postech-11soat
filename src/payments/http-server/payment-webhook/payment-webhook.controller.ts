import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { ZodValidationPipe } from 'src/infra/http-server/pipes/zod-validation-pipe';
import { PaymentWebhookPort } from 'src/payments/domain/ports/payment-webhook.port';
import { z } from 'zod';

const paymentWebhookBodySchema = z.object({
  data: z.object({
    id: z.string(),
  }),
  type: z.string(),
});
type PaymentWebhookBodySchema = z.infer<typeof paymentWebhookBodySchema>;


@Controller('/payments/webhook')
@ApiTags('Payments')
export class PaymentWebhookController {
  constructor(private paymentWebhookPort: PaymentWebhookPort) { }

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(paymentWebhookBodySchema))
  @ApiBody({ schema: zodToOpenAPI(paymentWebhookBodySchema) })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiOperation({
    summary: 'Receives payment updates from MercadoPago',
    description: `
This endpoint is called by MercadoPago when there are changes in the status of a payment.

- The 'data.id' field is used to search for the payment.
- The 'type' field defines the type of event (e.g. payment.approved).
- Updates the payment status in the system according to the event.

⚠️ Important: This endpoint is used exclusively for integration with MercadoPago webhooks.`,
  })
  async handle(@Body() body: PaymentWebhookBodySchema) {
    try {
      await this.paymentWebhookPort.execute({ externalId: body.data.id, status: body.type });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
