import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CustomersRepository } from 'src/customer/domain/ports/customers.repository';
import { PrismaCustomerMapper } from './mappers/prisma-customer-mapper';
import { Customer } from 'src/customer/domain/customer.entity';

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prisma: PrismaService) {}

  async existsByDocumentOrEmail(document: string, email: string): Promise<boolean> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { document },
          { email }
        ]
      }
    });
    
    return !!customer;
  }

  async save(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer);

    await this.prisma.customer.create({ data });
  }
}