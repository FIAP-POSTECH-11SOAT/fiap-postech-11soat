import {
  Controller,
  Delete,
  HttpCode,
  Logger,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteItemPort } from '../../domain/ports/delete-item.port';

@Controller('items')
@ApiTags('Items')
export class DeleteItemController {
  constructor(private deleteItemPort: DeleteItemPort) {}

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete an item' })
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
  async handle(@Param('id') id: string) {
    try {
      return await this.deleteItemPort.execute(id);
    } catch (error) {
      Logger.error(error);
      let message = 'Error deleting item';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
