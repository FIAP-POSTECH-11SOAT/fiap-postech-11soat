import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Put,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { UpdateCategoryUseCase } from '../domain/use-cases/update-category.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const updateCategoryBodySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: 'Name must not be empty' }),
});

type UpdateCategoryBodySchema = z.infer<typeof updateCategoryBodySchema>;

@Controller('/categories')
@ApiTags('Categories')
export class UpdateCategoryController {
  constructor(private updateCategory: UpdateCategoryUseCase) { }

  @Put()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(updateCategoryBodySchema))
  @ApiBody({ schema: zodToOpenAPI(updateCategoryBodySchema) })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Update a category',
    description:
      'This endpoint allows you to update the name of an existing category.',
  })
  async handle(@Body() body: UpdateCategoryBodySchema) {
    try {
      await this.updateCategory.execute(body);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
