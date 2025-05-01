import { Module } from '@nestjs/common';
import { Customer } from './domain/customer.entity';

@Module({
  providers: [Customer],
})
export class CustomerModule {}
