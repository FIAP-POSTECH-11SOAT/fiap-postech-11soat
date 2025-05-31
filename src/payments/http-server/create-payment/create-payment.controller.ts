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
import { CreatePaymentPort } from 'src/payments/domain/ports/create-payment.port';
import { z } from 'zod';

const createPaymentBodySchema = z.object({
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
});
type CreatePaymentBodySchema = z.infer<typeof createPaymentBodySchema>;

const createPaymentResponseSchema = z.object({
  paymentId: z.string().uuid(),
});

@Controller('/payments')
@ApiTags('Payments')
export class CreatePaymentController {
  constructor(private createPaymentPort: CreatePaymentPort) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPaymentBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createPaymentBodySchema) })
  @ApiResponse({ status: 201, description: 'Created', schema: zodToOpenAPI(createPaymentResponseSchema) })
  @ApiOperation({
    summary: 'Creates a new payment',
    description: 'Creates a new payment for the given orderId.',
  })
  async create(@Body() body: CreatePaymentBodySchema) {
    try {
      const paymentId = await this.createPaymentPort.execute(body.orderId);
      return { paymentId };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
