import { FullOrder } from 'src/shared/@types/FullOrder';

export abstract class GetOrderByIdPort {
  abstract execute(orderId: string): Promise<FullOrder | null>  
}
