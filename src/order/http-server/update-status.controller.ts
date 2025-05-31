import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Put,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { UpdateStatusPort } from '../domain/ports/update-status.port';
import { orderStatusValues } from 'src/shared/constants/order-status';

const updateStatusBodySchema = z.object({
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
  status: z.enum(orderStatusValues),
});

type UpdateStatusBodySchema = z.infer<typeof updateStatusBodySchema>;

@Controller('/orders/status')
@ApiTags('Orders')
export class UpdateStatusController {
  constructor(private updateStatusPort: UpdateStatusPort) { }

  @Put()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(updateStatusBodySchema))
  @ApiBody({ schema: zodToOpenAPI(updateStatusBodySchema) })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Update an order status',
    description: 'This endpoint allows you to update the status of an existing order.',
  })
  async handle(@Body() body: UpdateStatusBodySchema) {
    try {
      await this.updateStatusPort.execute(body.orderId, body.status);
    } catch (error) {
      Logger.error(error);
      let message = 'Error retrieving orders';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
