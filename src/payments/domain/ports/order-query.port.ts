export const ORDER_QUERY_PORT = Symbol('ORDER_QUERY_PORT');

export interface OrderQueryPort {
  getOrderStatus(orderId: string): Promise<{
    id: string;
    status: string;
    total: number;
  } | null>;
}
