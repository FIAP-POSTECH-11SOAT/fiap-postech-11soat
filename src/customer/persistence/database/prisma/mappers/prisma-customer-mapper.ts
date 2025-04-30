import { Prisma, Customer as PrismaCustomer } from '@prisma/client';
import { Customer } from 'src/customer/domain/customer.entity';
import { UniqueEntityID } from 'src/shared/entities/unique-entity-id';

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return new Customer(
      {
        name: raw.name,
        document: raw.document,
        email: raw.email,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      document: customer.document,
      email: customer.email,      
      name: customer.name,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      deletedAt: customer.deletedAt,
    };
  }
}
