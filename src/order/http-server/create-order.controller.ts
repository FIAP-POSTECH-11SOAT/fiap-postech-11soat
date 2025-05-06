import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../domain/use-cases/create-order.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';

const createOrderBodySchema = z.object({
  customerId: z.string().uuid({ message: 'Item ID must be a valid UUID' }),
});

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller('/orders')
@ApiTags('Orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createOrderBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Creates a new order',
    description: 'This endpoint creates a new order. It requires the customer ID.',
  })
  async handle(@Body() body: CreateOrderBodySchema) {
    try {
      const id = await this.createOrder.execute(body);
      return { id };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
