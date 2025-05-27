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
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { CreatePaymentUseCase } from '../domain/use-cases/create-payment/create-payment.service';
import { UpdatePaymentUseCase } from '../domain/use-cases/update-payment/update-payment.service';
import { GetPaymentByOrderIdUseCase } from '../domain/use-cases/get-payment-by-order-id/get-payment-by-order-id.service';
import { SearchPaymentsUseCase } from '../domain/use-cases/search-payments/search-payments.service';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentStatus, PaymentStatus as PrismaPaymentStatus } from '@prisma/client';
import { PaymentsRepository } from '../domain/ports/payments.repository';

const createPaymentBodySchema = z.object({
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
  amount: z
    .number()
    .positive({ message: 'Amount must be greater than zero' })
    .transform((value) => new Decimal(value)),
  qrCode: z.string().min(1, { message: 'QR Code must not be empty' }),
});

const updatePaymentBodySchema = z.object({
  status: z.nativeEnum(PrismaPaymentStatus),
});

@Controller('/payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly getPaymentByOrderIdUseCase: GetPaymentByOrderIdUseCase,
    private readonly searchPaymentsUseCase: SearchPaymentsUseCase,
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPaymentBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createPaymentBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiOperation({
    summary: 'Creates a new payment',
    description: 'Creates a new payment with orderId, amount, and qrCode.',
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
  async handleWebhook(@Body() body: { data: { id: string }; type: string }) {
    console.log('Webhook recebido:', JSON.stringify(body));

    try {
      const { id: externalId } = body.data;
      const eventType = body.type;

      if (!externalId || !eventType) {
        throw new Error('Payload inválido');
      }

      const payment = await this.paymentsRepository.findByExternalId(
        String(externalId),
      );

      if (!payment) {
        console.warn(`Pagamento com externalId ${externalId} não encontrado.`);
        return { message: 'Pagamento não encontrado' };
      }

      const statusMap: Record<string, string> = {
        'payment.created': 'PENDING',
        'payment.updated': 'PENDING',
        'payment.pre_authorized': 'PENDING',
        'payment.in_process': 'PENDING',
        'payment.authorized': 'APPROVED',
        'payment.approved': 'APPROVED',
        'payment.cancelled': 'FAILED',
        'payment.refunded': 'REFUNDED',
        'payment.rejected': 'FAILED',
      };

      const newStatus = statusMap[eventType];

      if (!newStatus) {
        console.warn(`Evento ${eventType} não mapeado.`);
        return { message: 'Evento não processado' };
      }

      await this.updatePaymentUseCase.execute(payment.id, {
        status: newStatus as PaymentStatus,
      });

      return { message: 'Status atualizado com sucesso' };
    } catch (error) {
      console.error('Erro no webhook:', error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updatePaymentBodySchema))
  @ApiParam({ name: 'id', type: 'string', description: 'Payment ID (UUID)' })
  @ApiBody({ schema: zodToOpenAPI(updatePaymentBodySchema) })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({
    summary: 'Updates a payment status',
    description: 'Updates the status of an existing payment by ID.',
  })
  async update(
    @Param('id') id: string,
    @Body() body: z.infer<typeof updatePaymentBodySchema>,
  ) {
    try {
      await this.updatePaymentUseCase.execute(id, body);
    } catch (error) {
      console.error(error);
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
