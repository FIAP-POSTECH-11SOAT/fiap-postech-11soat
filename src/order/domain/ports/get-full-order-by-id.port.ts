import { FullOrder } from 'src/shared/@types/FullOrder';

export abstract class GetFullOrderByIdPort {
  abstract execute(orderId: string): Promise<FullOrder | null>  
}
