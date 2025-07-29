import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Query,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetOrdersByFilterPort } from '../domain/ports/get-orders-by-filter';
import { orderStatusValues } from 'src/shared/constants/order-status';
import { z } from 'zod';
import { ZodValidationPipe } from 'nestjs-zod';
import { OrderPresenter } from './presenters/order.presenter';

const filterOrdersBodySchema = z.object({
  orderId: z.string().uuid({ message: 'Order ID must be a valid UUID' }).optional(),
  status: z.enum(orderStatusValues).optional(),
  customerId: z.string().uuid({ message: 'Customer ID must be a valid UUID' }).optional(),
  itemId: z.string().uuid({ message: 'Item ID must be a valid UUID' }).optional(),
  page: z.number().optional(),
  pageSize: z.number().min(1).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

type FilterOrdersBodySchema = z.infer<typeof filterOrdersBodySchema>;

@Controller('orders')
@ApiTags('Orders')
export class GetOrdersByFilterController {
  constructor(
    private getOrdersByFilter: GetOrdersByFilterPort
  ) { }

  @Get()
  @UsePipes(new ZodValidationPipe(filterOrdersBodySchema))
  @HttpCode(200)
  @ApiQuery({ name: 'orderId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String, enum: orderStatusValues })
  @ApiQuery({ name: 'customerId', required: false, type: String })
  @ApiQuery({ name: 'itemId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, minimum: 1 })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({ summary: 'Get orders by filters' })
  async handle(@Query() query: FilterOrdersBodySchema) {
    try {
      const result = await this.getOrdersByFilter.execute(query);
      return result.map(OrderPresenter.toHTTP);
    } catch (error) {
      Logger.error(error);
      let message = 'Error retrieving orders';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
