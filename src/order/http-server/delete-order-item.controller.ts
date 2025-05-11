import {
  Body,
  Controller,
  Delete,
  HttpCode,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { DeleteOrderItemPort } from '../domain/ports/delete-order-item.port';

const deleteOrderItemBodySchema = z.object({
  itemId: z.string().uuid({ message: 'Item ID must be a valid UUID' }),
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
});

@Controller('/orders/items')
@ApiTags('Orders')
export class DeleteOrderItemController {
  constructor(private deleteOrderItemPort: DeleteOrderItemPort) { }

  @Delete()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(deleteOrderItemBodySchema))
  @ApiBody({ schema: zodToOpenAPI(deleteOrderItemBodySchema) })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Delete a item from an order',
    description:
      'This endpoint allows you to delete an item from an order. It requires the item ID and order ID.',
  })
  async handle(@Body() body: z.infer<typeof deleteOrderItemBodySchema>) {
    try {
      await this.deleteOrderItemPort.execute(body.orderId, body.itemId);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
