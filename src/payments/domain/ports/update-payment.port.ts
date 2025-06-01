import { PaymentStatus } from "../payment.entity"

export interface UpdatePaymentInput {
  id: string
  payload: {
    status: PaymentStatus
  }
}

export abstract class UpdatePaymentPort {
  abstract execute(input: UpdatePaymentInput): Promise<void>;
}
