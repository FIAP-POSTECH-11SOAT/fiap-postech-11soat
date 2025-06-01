import {
    Body,
    Controller,
    HttpCode,
    Put,
    UnprocessableEntityException,
    UsePipes,
  } from '@nestjs/common';
  import {
    UpdateCustomerPort,
    UpdateCustomerProps,
  } from '../domain/ports/update-customer.port';
  import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
  import { z } from 'zod';
  
  const updateCustomerBodySchema = z.object({
    name: z.string().min(1, { message: 'Name must not be empty' }),
    document: z.string().min(11, { message: 'Document must not be empty' }),
    email: z.string().email().min(5, { message: 'Email must not be empty' })
  });
  
  type UpdateCustomerBodySchema = z.infer<typeof updateCustomerBodySchema>;
  
  @Controller('/customers')
  @ApiTags('Customers')
  export class UpdateCustomerController {
    constructor(private updateCustomerPort: UpdateCustomerPort) {}
  
    @Put()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(updateCustomerBodySchema))
    @ApiBody({ schema: zodToOpenAPI(updateCustomerBodySchema) })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    @ApiOperation({
      summary: 'Update a customer',
      description:
        'This endpoint update a existente customer',
    })
    async handle(@Body() { document, ...data }: UpdateCustomerBodySchema) {
      try {
        await this.updateCustomerPort.execute(document, data as UpdateCustomerProps);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }
