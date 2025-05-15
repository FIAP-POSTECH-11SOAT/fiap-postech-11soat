import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { CreateOrderPort } from '../domain/ports/create-order.port';

const createOrderBodySchema = z.object({
  customerId: z.string().uuid({ message: 'Item ID must be a valid UUID' }).optional(),
});

@Controller('/orders')
@ApiTags('Orders')
export class CreateOrderController {
  constructor(private createOrderPort: CreateOrderPort) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createOrderBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Creates a new order',
    description: 'This endpoint creates a new order. The customer ID is optional.',
  })
  async handle(@Body() body: z.infer<typeof createOrderBodySchema>) {
    try {
      const id = await this.createOrderPort.execute(body.customerId);
      return { id };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
