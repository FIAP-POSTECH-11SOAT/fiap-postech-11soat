import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { CreatePaymentUseCase } from '../domain/use-cases/create-payment/create-payment.service';
import { Decimal } from '@prisma/client/runtime/library';

const createPaymentBodySchema = z.object({
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
  amount: z
    .number()
    .positive({ message: 'Amount must be greater than zero' })
    .transform((value) => new Decimal(value)),
  qrCode: z.string().min(1, { message: 'QR Code must not be empty' }),
});

@Controller('/payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(private readonly createPaymentUseCase: CreatePaymentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPaymentBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createPaymentBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Creates a new payment',
    description:
      'This endpoint creates a new payment. It requires orderId, amount, and qrCode.',
  })
  async handle(@Body() body: z.infer<typeof createPaymentBodySchema>) {
    try {
      const paymentId = await this.createPaymentUseCase.execute(body);
      return { paymentId };
    } catch (error) {
      console.error(error);
      throw new UnprocessableEntityException(error.message);
    }
  }
}
