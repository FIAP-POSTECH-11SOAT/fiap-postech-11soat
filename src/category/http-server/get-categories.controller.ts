import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { GetCategoriesUseCase } from '../domain/use-cases/get-categories.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const deleteCategoryResponseSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
  ),
});

type DeleteCategoryResponseSchema = z.infer<typeof deleteCategoryResponseSchema>;

@Controller('/categories')
@ApiTags('Categories')
export class GetCategoriesController {
  constructor(private getCategories: GetCategoriesUseCase) { }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(deleteCategoryResponseSchema) })
  @ApiOperation({
    summary: 'Get all categories',
    description:
      'This endpoint allows you to get all categories. The categories are returned in an array.',
  })
  async handle() {
    const categories = await this.getCategories.execute();

    const response = categories.map((category) => ({
      id: category.id,
      name: category.name
    }))

    return {
      categories: response
    }
  }
}
