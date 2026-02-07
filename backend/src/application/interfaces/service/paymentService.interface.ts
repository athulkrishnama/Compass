export interface IPaymentService {
  createPaymentIntent(
    amount: number,
    metadata: Record<string, string>,
  ): Promise<{ paymentIntentId: string; clientSecret: string }>;

  confirmPayment(
    signature: string,
    body: string | Buffer<ArrayBufferLike>,
  ): Promise<{
    status: boolean;
    metadata?: Record<string, string>;
    paymentIntentId?: string;
  }>;
}
