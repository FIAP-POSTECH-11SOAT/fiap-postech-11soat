import {
    Controller,
    HttpCode,
    Get,
    NotFoundException,
    Param,
    UsePipes,
  } from '@nestjs/common';
  import { GetCustomerUseCase } from '../domain/use-cases/get-customer.service';
  import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { ZodValidationPipe } from 'nestjs-zod';
  import { z } from 'zod';
  
  const getCustomerParamSchema = z.string().length(11, { message: "Must be exactly 11 characters long" });
  
  @Controller('/customers')
  @ApiTags('Customers')
  export class GetCustomerController {
    constructor(private getCustomer: GetCustomerUseCase) {}
  
    @Get(':document')
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(getCustomerParamSchema))
    @ApiParam({ name: 'document', required: true, description: 'Customer document number' })
    @ApiResponse({ status: 200, description: 'OK' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    @ApiOperation({
      summary: 'Search customer by document',
      description:
        'This endpoint search a customer by document number',
    })
    async handle(@Param('document') document: string) {
        const customer = await this.getCustomer.execute({ document });
        
        if (!customer) {
        throw new NotFoundException(`Customer with document ${document} not found`);
        }
        
        return customer;
    }    
  }
