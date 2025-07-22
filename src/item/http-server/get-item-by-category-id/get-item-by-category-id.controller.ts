import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetItemByCategoryIdPort } from '../../domain/ports/get-item-by-category-id.port';
import { ItemPresenter } from '../item.presenter';

@Controller('items')
@ApiTags('Items')
export class GetItemByCategoryIdController {
  constructor(private getItemByCategoryIdPort: GetItemByCategoryIdPort) {}
  @Get('categories/:categoryId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Success',
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
  @ApiOperation({ summary: 'Get item by Category ID' })
  async getItemByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<ItemPresenter[]> {
    try {
      const items = await this.getItemByCategoryIdPort.execute(categoryId);
      return items.map((item) => ItemPresenter.toHttp(item));
    } catch (error) {
      Logger.error(error);
      let message = 'Error getting items';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
