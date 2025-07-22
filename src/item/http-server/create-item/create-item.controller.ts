import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { CreateItemPort } from '../../domain/ports/create-item.port';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { ItemPresenter } from '../item.presenter';

const createItemBodySchema = z.object({
  name: z.string().min(1, { message: 'Name must not be empty' }),
  price: z.number().min(1, { message: 'Price must not be empty' }),
  description: z.string().min(1, { message: 'Description must not be empty' }),
  image: z.string().optional(),
  categoryId: z.string().min(1, { message: 'Category ID must not be empty' }),
});

@Controller('items')
@ApiTags('Items')
export class CreateItemController {
  constructor(private createItemPort: CreateItemPort) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createItemBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createItemBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Create a new item',
    description:
      'This endpoint creates a new item. The name of the item must be unique and category must exist.',
  })
  async handle(
    @Body() body: z.infer<typeof createItemBodySchema>,
  ): Promise<ItemPresenter> {
    try {
      const item = await this.createItemPort.execute(body);
      return ItemPresenter.toHttp(item);
    } catch (error) {
      Logger.error(error);
      let message = 'Error creating item';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
