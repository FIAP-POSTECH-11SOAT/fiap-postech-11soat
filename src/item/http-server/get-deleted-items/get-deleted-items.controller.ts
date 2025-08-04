import {
  Controller,
  Get,
  HttpCode,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GetDeletedItemsPort } from '../../domain/ports/get-deleted-items.port';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemPresenter } from '../item.presenter';

@Controller('items')
@ApiTags('Items')
export class GetDeletedItemsController {
  constructor(private getDeletedItemsPort: GetDeletedItemsPort) {}

  @Get('/status/deleted')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get deleted items' })
  @ApiResponse({
    status: 200,
    description: 'Get deleted items',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          image: { type: 'string' },
          categoryId: { type: 'string' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          deletedAt: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity',
  })
  async handle(): Promise<ItemPresenter[]> {
    try {
      const items = await this.getDeletedItemsPort.execute();
      return items.map((item) => ItemPresenter.toHttp(item));
    } catch (error) {
      Logger.error(error);
      let message = 'Error creating item';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
