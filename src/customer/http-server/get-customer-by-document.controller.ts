import {
  Controller,
  HttpCode,
  Get,
  Logger,
  UnprocessableEntityException,
  NotFoundException,
  Param,
  UsePipes,
} from '@nestjs/common';
import { GetCustomerByDocumentPort } from '../domain/ports/get-customer-by-document.port'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { CustomerPresenter } from './customer.presenter';

const getCustomerParamSchema = z.string().length(11, { message: "Must be exactly 11 characters long" });

const getCustomerResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  document: z.string(),
  email: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

@Controller('/customers')
@ApiTags('Customers')
export class GetCustomerByDocumentController {
  constructor(private getCustomerByDocumentPort: GetCustomerByDocumentPort) { }

  @Get(':document')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getCustomerParamSchema))
  @ApiParam({ name: 'document', required: true, description: 'Customer document number' })
  @ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(getCustomerResponseSchema) })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiOperation({
    summary: 'Search customer by document',
    description:
      'This endpoint search a customer by document number',
  })
  async handle(@Param('document') document: string) {
    try {
      const customer = await this.getCustomerByDocumentPort.execute(document);
      return CustomerPresenter.toHTTP(customer);
    } catch (error) {
      Logger.error(error);

      if (error instanceof NotFoundException) { throw error; }

      let message = 'Error get customer';
      if (error instanceof Error) message = error.message;
      throw new UnprocessableEntityException(message);
    }
  }
}
