import {
  Controller,
  Delete,
  HttpCode,
  Logger,
  Param,
  Patch,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivateItemPort } from '../../domain/ports/activate-item.port';
import { Item } from '../../domain/item.entity';

@Controller('items')
@ApiTags('Items')
export class ActivateItemController {
  constructor(private activateItemPort: ActivateItemPort) {}

  @Patch(':id/activate')
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Activate an item' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
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
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity',
  })
  async activateItem(@Param('id') id: string): Promise<Item> {
    try {
      return await this.activateItemPort.execute(id);
    } catch (error) {
      Logger.error(error);
      let message = 'Error activating item';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
