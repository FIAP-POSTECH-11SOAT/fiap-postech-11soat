export interface PaymentWebhookInput {
  externalId: string;
  status: string;
}

export abstract class PaymentWebhookPort {
  abstract execute(input: PaymentWebhookInput): Promise<void>;
}