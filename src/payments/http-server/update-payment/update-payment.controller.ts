import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { PaymentStatus } from 'src/payments/domain/payment.entity';
import { UpdatePaymentPort } from 'src/payments/domain/ports/update-payment.port';
import { z } from 'zod';

const updatePaymentBodySchema = z.object({
  status: z.nativeEnum(PaymentStatus),
});
type UpdatePaymentBodySchema = z.infer<typeof updatePaymentBodySchema>;

const updatePaymentParamsSchema = z.object({
  id: z.string().uuid(),
});

@Controller('/payments/:id')
@ApiTags('Payments')
export class UpdatePaymentController {
  constructor(private updatePaymentPort: UpdatePaymentPort) { }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updatePaymentBodySchema))
  @ApiBody({ schema: zodToOpenAPI(updatePaymentBodySchema) })
  @ApiParam({ name: 'id', schema: zodToOpenAPI(updatePaymentParamsSchema) })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiOperation({
    summary: 'Updates a payment status',
    description: 'Updates the status of an existing payment by ID.',
  })
  async handle(@Param('id') id: string, @Body() body: UpdatePaymentBodySchema) {
    try {
      await this.updatePaymentPort.execute({ id, payload: { status: body.status } });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
