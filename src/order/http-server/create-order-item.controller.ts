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
import { Decimal } from '@prisma/client/runtime/library';
import { CreateOrderItemUseCase } from '../domain/use-cases/create-order-item.service';

const createOrderItemBodySchema = z.object({
  itemId: z.string().uuid({ message: 'Item ID must be a valid UUID' }),
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }),
  quantity: z.number().positive({ message: 'Quantity must be greater than zero' }),
  price: z.number().gte(0, { message: 'Price must be greater than or equal to zero' }).transform((value) => new Decimal(value)),
});

type CreateOrderItemBodySchema = z.infer<typeof createOrderItemBodySchema>;

@Controller('/orders/items')
@ApiTags('Orders')
export class CreateOrderItemController {
  constructor(private createOrderItem: CreateOrderItemUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderItemBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createOrderItemBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Creates a new order item',
    description: 'This endpoint creates a new order item. It requires the item ID, order ID, quantity, and price.',
  })
  async handle(@Body() body: CreateOrderItemBodySchema) {
    try {
      await this.createOrderItem.execute(body);
    } catch (error) {
      console.log(error)
      throw new UnprocessableEntityException(error.message);
    }
  }
}
