import {
  Controller,
  Get,
  HttpCode,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetItemsPort } from '../../domain/ports/get-items.port';

@Controller('items')
@ApiTags('Items')
export class GetItemsController {
  constructor(private getItemsPort: GetItemsPort) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({ summary: 'Get all items' })
  async getItems() {
    try {
      return await this.getItemsPort.execute();
    } catch (error) {
      Logger.error(error);
      let message = 'Error creating item';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
