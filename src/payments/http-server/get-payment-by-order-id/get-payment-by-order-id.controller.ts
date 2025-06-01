import {
  Controller,
  Get,
  HttpCode,
  Param,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { ZodValidationPipe } from 'src/infra/http-server/pipes/zod-validation-pipe';
import { PaymentStatus } from 'src/payments/domain/payment.entity';
import { GetPaymentByOrderIdPort } from 'src/payments/domain/ports/get-payment-by-order-id.port';
import { z } from 'zod';

const getPaymentByOrderIdParamsSchema = z.object({
  orderId: z.string().uuid(),
});
type GetPaymentByOrderIdParamsSchema = z.infer<typeof getPaymentByOrderIdParamsSchema>;

const getPaymentByOrderIdResponseSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  externalId: z.string().uuid(),
  status: z.nativeEnum(PaymentStatus),
  amount: z.number().positive(),
  qrCode: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

@Controller('/payments/orders/:orderId')
@ApiTags('Payments')
export class GetPaymentByOrderIdController {
  constructor(private getPaymentByOrderIdPort: GetPaymentByOrderIdPort) { }

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getPaymentByOrderIdParamsSchema))
  @ApiParam({ name: 'orderId', schema: zodToOpenAPI(z.string().uuid()) })
  @ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(getPaymentByOrderIdResponseSchema) })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Get a payment by order ID',
    description: 'Retrieves a payment associated with a given order ID.',
  })
  async handle(@Param() params: GetPaymentByOrderIdParamsSchema) {
    try {
      const payment = await this.getPaymentByOrderIdPort.execute(params.orderId);
      return {
        id: payment.id,
        orderId: payment.orderId,
        externalId: payment.externalId,
        status: payment.status,
        amount: payment.amount,
        qrCode: payment.qrCode,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
