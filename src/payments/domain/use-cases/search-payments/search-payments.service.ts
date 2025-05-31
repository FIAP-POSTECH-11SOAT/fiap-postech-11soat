import { Injectable } from '@nestjs/common';
import { PaymentsRepository } from '../../ports/payments.repository';
import { Payment } from '../../payment.entity';
import { SearchPaymentsFilters, SearchPaymentsPort } from '../../ports/search-payments.port';

@Injectable()
export class SearchPaymentsUseCase implements SearchPaymentsPort {
  constructor(private readonly paymentsRepository: PaymentsRepository) { }

  async execute(
    filters: SearchPaymentsFilters,
  ): Promise<{ data: Payment[]; total: number }> {
    return this.paymentsRepository.search(filters);
  }
}
