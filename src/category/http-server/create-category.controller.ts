import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { CreateCategoryUseCase } from '../domain/use-cases/create-category.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const createCategoryBodySchema = z.object({
  name: z.string().min(1, { message: 'Name must not be empty' }),
});

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>;

@Controller('/categories')
@ApiTags('Categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCategoryBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createCategoryBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Create a new category',
    description:
      'This endpoint creates a new category. The name of the category must be unique.',
  })
  async handle(@Body() body: CreateCategoryBodySchema) {
    try {
      await this.createCategory.execute(body);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
