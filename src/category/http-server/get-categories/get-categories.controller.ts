import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { z } from 'zod';
import { GetCategoriesPort } from 'src/category/domain/ports/get-categories.port';

const getCategoriesResponseSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
  ),
});

@Controller('/categories')
@ApiTags('Categories')
export class GetCategoriesController {
  constructor(private getCategoriesPort: GetCategoriesPort) { }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(getCategoriesResponseSchema) })
  @ApiOperation({
    summary: 'Get all categories',
    description:
      'This endpoint allows you to get all categories. The categories are returned in an array.',
  })
  async handle() {
    const categories = await this.getCategoriesPort.execute();

    const response = categories.map((category) => ({
      id: category.id,
      name: category.name
    }))

    return {
      categories: response
    }
  }
}
