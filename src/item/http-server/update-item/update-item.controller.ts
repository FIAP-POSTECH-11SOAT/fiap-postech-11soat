import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Patch,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UpdateItemPort,
  UpdateItemProps,
} from '../../domain/ports/update-item.port';
import { z } from 'zod';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';

const updateItemBodySchema = z.object({
  id: z.string().uuid().min(1, { message: 'Item ID must not be empty' }),
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional().nullable(),
  categoryId: z.string().optional(),
});

type UpdateItemBodySchema = z.infer<typeof updateItemBodySchema>;

@Controller('items')
@ApiTags('Items')
export class UpdateItemController {
  constructor(private updateItemPort: UpdateItemPort) {}

  @Patch()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(updateItemBodySchema))
  @ApiBody({ schema: zodToOpenAPI(updateItemBodySchema) })
  @ApiOperation({ summary: 'Update an item' })
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
  async handle(@Body() { id, ...data }: UpdateItemBodySchema) {
    try {
      return await this.updateItemPort.execute(id, data as UpdateItemProps);
    } catch (error) {
      Logger.error(error);
      let message = 'Error updating item';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
