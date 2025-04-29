import {
    Body,
    Controller,
    HttpCode,
    Post,
    UnprocessableEntityException,
    UsePipes,
  } from '@nestjs/common';
  import { CreateCustomerUseCase } from '../domain/use-cases/create-customer.service';
  import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';
  import { z } from 'zod';
  
  const createCustomerBodySchema = z.object({
    name: z.string().min(1, { message: 'Name must not be empty' }),
  });
  
  type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>;
  
  @Controller('/customers')
  @ApiTags('Customers')
  export class CreateCustomerController {
    constructor(private createCustomer: CreateCustomerUseCase) {}
  
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createCustomerBodySchema))
    @ApiBody({ schema: zodToOpenAPI(createCustomerBodySchema) })
    @ApiResponse({ status: 201, description: 'Created' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    @ApiOperation({
      summary: 'Create a new customer',
      description:
        'This endpoint creates a new customer. The document and email of the customer must be unique.',
    })
    async handle(@Body() body: CreateCustomerBodySchema) {
      try {
        await this.createCustomer.execute(body);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }