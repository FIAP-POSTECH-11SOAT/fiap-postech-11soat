import { Payment } from '../../payment.entity';

export interface SearchPaymentsFilters {
  status?: string;
  orderId?: string;
  cpf?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export abstract class SearchPaymentsPort {
  abstract execute(
    filters: SearchPaymentsFilters,
  ): Promise<{ data: Payment[]; total: number }>;
}
