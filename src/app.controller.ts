import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('/health-check')
@ApiTags('App')
export class HealthCheckController {
  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Health Check',
    description: 'This endpoint allows you to verify if the server is online.',
  })
  handle(): string {
    return 'OK'
  }
}