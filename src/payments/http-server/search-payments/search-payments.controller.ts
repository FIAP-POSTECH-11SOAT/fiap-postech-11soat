import {
  Controller,
  Get,
  HttpCode,
  Query,
  UnprocessableEntityException,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { ZodValidationPipe } from 'src/infra/http-server/pipes/zod-validation-pipe';
import { PaymentStatus } from 'src/payments/domain/payment.entity';
import { SearchPaymentsPort } from 'src/payments/domain/ports/search-payments.port';
import { z } from 'zod';

const searchPaymentsQuerySchema = z.object({
  orderId: z.string().uuid().optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  cpf: z.string().length(11).optional(),
  page: z.coerce.number().default(1).optional(),
  pageSize: z.coerce.number().default(10).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
});
type SearchPaymentsQuerySchema = z.infer<typeof searchPaymentsQuerySchema>;

const searchPaymentsResponseSchema = z.object({
  total: z.number(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
      orderId: z.string().uuid(),
      status: z.nativeEnum(PaymentStatus),
      amount: z.number().positive(),
      qrCode: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  ),
});

@Controller('/payments')
@ApiTags('Payments')
export class SearchPaymentsController {
  constructor(private searchPaymentsPort: SearchPaymentsPort) { }

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(searchPaymentsQuerySchema))
  @ApiQuery({ name: 'status', required: false, schema: zodToOpenAPI(z.nativeEnum(PaymentStatus).optional()) })
  @ApiQuery({ name: 'orderId', required: false, schema: zodToOpenAPI(z.string().uuid().optional()) })
  @ApiQuery({ name: 'cpf', required: false, schema: zodToOpenAPI(z.string().length(11).optional()) })
  @ApiQuery({ name: 'page', required: false, schema: zodToOpenAPI(z.number().default(1).optional()) })
  @ApiQuery({ name: 'pageSize', required: false, schema: zodToOpenAPI(z.number().default(10).optional()) })
  @ApiQuery({ name: 'sortBy', required: false, schema: zodToOpenAPI(z.string().optional()) })
  @ApiQuery({ name: 'sortOrder', required: false, schema: zodToOpenAPI(z.enum(['asc', 'desc']).default('asc').optional()) })
  @ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(searchPaymentsResponseSchema) })
  @ApiOperation({
    summary: 'Search payments',
    description: 'Search payments with filters, pagination, and sorting.',
  })
  async search(@Query() query: SearchPaymentsQuerySchema) {
    try {
      const result = await this.searchPaymentsPort.execute(query);

      const data = result.data.map((payment) => ({
        id: payment.id,
        orderId: payment.orderId,
        status: payment.status,
        amount: payment.amount,
        qrCode: payment.qrCode,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      }))

      return {
        total: result.total,
        data,
      };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
