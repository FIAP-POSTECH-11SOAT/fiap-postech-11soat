import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetFullOrderByIdPort } from '../domain/ports/get-full-order-by-id.port';

@Controller('orders')
@ApiTags('Orders')
export class GetFullOrderByIdController {
  constructor(private getFullOrderByIdPort: GetFullOrderByIdPort) { }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({ summary: 'Get full order information by ID' })
  async handle(@Param('id') id: string) {
    try {
      return await this.getFullOrderByIdPort.execute(id);
    } catch (error) {
      Logger.error(error);
      let message = 'Error retrieving order';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
