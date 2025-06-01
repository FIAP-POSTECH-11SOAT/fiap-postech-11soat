import {
  Body,
  Controller,
  Delete,
  HttpCode,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { DeleteCategoryPort } from 'src/category/domain/ports/delete-category.port';

const deleteCategoryBodySchema = z.object({
  id: z.string().uuid(),
});

type DeleteCategoryBodySchema = z.infer<typeof deleteCategoryBodySchema>;

@Controller('/categories')
@ApiTags('Categories')
export class DeleteCategoryController {
  constructor(private deleteCategoryPort: DeleteCategoryPort) { }

  @Delete()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(deleteCategoryBodySchema))
  @ApiBody({ schema: zodToOpenAPI(deleteCategoryBodySchema) })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Soft delete a category',
    description:
      'This endpoint allows you to soft delete a category by its ID. The category will be marked as deleted in the database, but not physically removed.',
  })
  async handle(@Body() body: DeleteCategoryBodySchema) {
    try {
      await this.deleteCategoryPort.execute(body);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
