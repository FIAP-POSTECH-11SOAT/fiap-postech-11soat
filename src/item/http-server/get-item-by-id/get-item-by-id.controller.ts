import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetItemByIdPort } from '../../domain/ports/get-item-by-id.port';
import { ItemPresenter } from '../item.presenter';

@Controller('items')
@ApiTags('Items')
export class GetItemByIdController {
  constructor(private readonly getItemByIdPort: GetItemByIdPort) {}

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({ summary: 'Get item by ID' })
  async getItemById(@Param('id') id: string): Promise<ItemPresenter> {
    try {
      const item = await this.getItemByIdPort.execute(id);
      return ItemPresenter.toHttp(item);
    } catch (error) {
      Logger.error(error);
      let message = 'Error creating item';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
