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
import { ZodValidationPipe, zodToOpenAPI } from 'nestjs-zod';

import { CreatePaymentUseCase } from '../domain/use-cases/create-payment/create-payment.service';
import { UpdatePaymentUseCase } from '../domain/use-cases/update-payment/update-payment.service';
import { GetPaymentByOrderIdUseCase } from '../domain/use-cases/get-payment-by-order-id/get-payment-by-order-id.service';
import { SearchPaymentsUseCase } from '../domain/use-cases/search-payments/search-payments.service';
import { HandlePaymentWebhookUseCase } from '../domain/use-cases/handle-payment-webhook/handle-payment-webhook.service';

// import { Decimal } from '@prisma/client/runtime/library';
import { PaymentStatus as PrismaPaymentStatus } from '@prisma/client';
import { PaymentStatusMapper } from '../domain/mappers/payment-status.mapper';

const createPaymentBodySchema = z.object({
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
  // amount: z
  //   .number()
  //   .positive({ message: 'Amount must be greater than zero' })
  //   .transform((value) => new Decimal(value)),
  // qrCode: z.string().min(1, { message: 'QR Code must not be empty' }),
});

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
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly getPaymentByOrderIdUseCase: GetPaymentByOrderIdUseCase,
    private readonly searchPaymentsUseCase: SearchPaymentsUseCase,
    private readonly handlePaymentWebhookUseCase: HandlePaymentWebhookUseCase,
  ) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPaymentBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createPaymentBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({
    summary: 'Creates a new payment',
    description: 'Creates a new payment for the given orderId.',
  })
  async create(@Body() body: z.infer<typeof createPaymentBodySchema>) {
    try {
      const paymentId = await this.createPaymentUseCase.execute(body.orderId);
      return { paymentId };
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }

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

  @Get('order/:orderId')
  @HttpCode(200)
  @ApiParam({ name: 'orderId', type: 'string', description: 'Order ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Payment found' })
  @ApiOperation({
    summary: 'Gets a payment by order ID',
    description: 'Retrieves a payment associated with a given order ID.',
  })
  async getByOrderId(@Param('orderId') orderId: string) {
    try {
      const payment = await this.getPaymentByOrderIdUseCase.execute(orderId);
      if (!payment) throw new Error('Payment not found');
      return payment;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get()
  @HttpCode(200)
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'orderId', required: false })
  @ApiQuery({ name: 'cpf', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @ApiOperation({
    summary: 'Search payments',
    description: 'Search payments with filters, pagination, and sorting.',
  })
  async search(@Query() query: any) {
    try {
      const result = await this.searchPaymentsUseCase.execute(query);
      return result;
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }
}
