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
import { CreateOrderItemPort } from '../domain/ports/create-order-item.port';

const createOrderItemBodySchema = z.object({
  itemId: z.string().uuid({ message: 'Item ID must be a valid UUID' }),
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
  quantity: z.number().positive({ message: 'Quantity must be greater than zero' }),
});

@Controller('/orders/items')
@ApiTags('Orders')
export class CreateOrderItemController {
  constructor(private createOrderItemPort: CreateOrderItemPort) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderItemBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createOrderItemBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Creates a new order item',
    description: 'This endpoint creates a new order item. It requires the item ID, order ID and quantity.',
  })
  async handle(@Body() body: z.infer<typeof createOrderItemBodySchema>) {
    try {
      await this.createOrderItemPort.execute({ ...body, price: 0 });
    } catch (error) {
      console.log(error)
      throw new UnprocessableEntityException(error.message);
    }
  }
}
